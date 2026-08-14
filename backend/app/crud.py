import json
import csv
import io
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas

def parse_json_field(val: Optional[str], default: any):
    if not val:
        return default
    try:
        return json.loads(val)
    except Exception:
        return default

def dump_json_field(val: any):
    if val is None:
        return None
    return json.dumps(val)

# FORMS CRUD
def get_forms(db: Session) -> List[schemas.FormListOut]:
    forms = db.query(models.Form).order_by(models.Form.updated_at.desc()).all()
    result = []
    for f in forms:
        q_count = db.query(func.count(models.Question.id)).filter(models.Question.form_id == f.id).scalar() or 0
        r_count = db.query(func.count(models.Response.id)).filter(models.Response.form_id == f.id).scalar() or 0
        result.append(schemas.FormListOut(
            id=f.id,
            title=f.title,
            description=f.description,
            status=f.status,
            share_slug=f.share_slug,
            created_at=f.created_at,
            updated_at=f.updated_at,
            question_count=q_count,
            response_count=r_count
        ))
    return result

def get_form(db: Session, form_id: str) -> Optional[schemas.FormOut]:
    form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not form:
        return None
    
    r_count = db.query(func.count(models.Response.id)).filter(models.Response.form_id == form.id).scalar() or 0
    questions_out = []
    for q in form.questions:
        questions_out.append(schemas.QuestionOut(
            id=q.id,
            form_id=q.form_id,
            type=q.type,
            title=q.title,
            description=q.description,
            required=q.required,
            order_index=q.order_index,
            properties=parse_json_field(q.properties, {}),
            logic_rules=parse_json_field(q.logic_rules, [])
        ))
    
    return schemas.FormOut(
        id=form.id,
        title=form.title,
        description=form.description,
        status=form.status,
        share_slug=form.share_slug,
        theme_config=parse_json_field(form.theme_config, {"primary_color": "#262626", "background_color": "#FFFFFF", "text_color": "#191919", "font_family": "Inter"}),
        thank_you_title=form.thank_you_title,
        thank_you_message=form.thank_you_message,
        created_at=form.created_at,
        updated_at=form.updated_at,
        questions=questions_out,
        response_count=r_count
    )

def get_form_by_slug_or_id(db: Session, identifier: str) -> Optional[schemas.FormOut]:
    form = db.query(models.Form).filter((models.Form.share_slug == identifier) | (models.Form.id == identifier)).first()
    if not form:
        return None
    return get_form(db, form.id)

def create_form(db: Session, form_in: schemas.FormCreate) -> schemas.FormOut:
    theme_str = dump_json_field(form_in.theme_config) if form_in.theme_config else dump_json_field({
        "primary_color": "#262626",
        "background_color": "#FFFFFF",
        "text_color": "#191919",
        "font_family": "Inter"
    })
    db_form = models.Form(
        title=form_in.title,
        description=form_in.description,
        theme_config=theme_str,
        thank_you_title=form_in.thank_you_title or "Thank you!",
        thank_you_message=form_in.thank_you_message or "Your response has been registered successfully."
    )
    db.add(db_form)
    db.commit()
    db.refresh(db_form)
    
    # Add a default welcome question
    default_q = models.Question(
        form_id=db_form.id,
        type="short_text",
        title="What is your name?",
        description="Please type your full name below.",
        required=True,
        order_index=0,
        properties=dump_json_field({"placeholder": "Type your answer here..."})
    )
    db.add(default_q)
    db.commit()
    
    return get_form(db, db_form.id)

def update_form(db: Session, form_id: str, form_in: schemas.FormUpdate) -> Optional[schemas.FormOut]:
    form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not form:
        return None
    
    if form_in.title is not None:
        form.title = form_in.title
    if form_in.description is not None:
        form.description = form_in.description
    if form_in.status is not None:
        form.status = form_in.status
    if form_in.theme_config is not None:
        form.theme_config = dump_json_field(form_in.theme_config)
    if form_in.thank_you_title is not None:
        form.thank_you_title = form_in.thank_you_title
    if form_in.thank_you_message is not None:
        form.thank_you_message = form_in.thank_you_message

    db.commit()
    return get_form(db, form_id)

def delete_form(db: Session, form_id: str) -> bool:
    form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not form:
        return False
    db.delete(form)
    db.commit()
    return True

def duplicate_form(db: Session, form_id: str) -> Optional[schemas.FormOut]:
    original = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not original:
        return None
    
    new_form = models.Form(
        title=f"{original.title} (Copy)",
        description=original.description,
        status="draft",
        theme_config=original.theme_config,
        thank_you_title=original.thank_you_title,
        thank_you_message=original.thank_you_message
    )
    db.add(new_form)
    db.commit()
    db.refresh(new_form)

    # Copy questions
    for q in original.questions:
        new_q = models.Question(
            form_id=new_form.id,
            type=q.type,
            title=q.title,
            description=q.description,
            required=q.required,
            order_index=q.order_index,
            properties=q.properties,
            logic_rules=q.logic_rules
        )
        db.add(new_q)
    db.commit()

    return get_form(db, new_form.id)

# QUESTIONS CRUD
def create_question(db: Session, form_id: str, q_in: schemas.QuestionCreate) -> schemas.QuestionOut:
    # Get max order_index
    max_idx = db.query(func.max(models.Question.order_index)).filter(models.Question.form_id == form_id).scalar()
    next_idx = 0 if max_idx is None else max_idx + 1

    props = dump_json_field(q_in.properties or {})
    logic = dump_json_field(q_in.logic_rules or [])

    db_q = models.Question(
        form_id=form_id,
        type=q_in.type,
        title=q_in.title,
        description=q_in.description,
        required=q_in.required or False,
        order_index=next_idx,
        properties=props,
        logic_rules=logic
    )
    db.add(db_q)
    db.commit()
    db.refresh(db_q)

    return schemas.QuestionOut(
        id=db_q.id,
        form_id=db_q.form_id,
        type=db_q.type,
        title=db_q.title,
        description=db_q.description,
        required=db_q.required,
        order_index=db_q.order_index,
        properties=parse_json_field(db_q.properties, {}),
        logic_rules=parse_json_field(db_q.logic_rules, [])
    )

def update_question(db: Session, q_id: str, q_in: schemas.QuestionUpdate) -> Optional[schemas.QuestionOut]:
    q = db.query(models.Question).filter(models.Question.id == q_id).first()
    if not q:
        return None
    
    if q_in.type is not None:
        q.type = q_in.type
    if q_in.title is not None:
        q.title = q_in.title
    if q_in.description is not None:
        q.description = q_in.description
    if q_in.required is not None:
        q.required = q_in.required
    if q_in.order_index is not None:
        q.order_index = q_in.order_index
    if q_in.properties is not None:
        q.properties = dump_json_field(q_in.properties)
    if q_in.logic_rules is not None:
        q.logic_rules = dump_json_field(q_in.logic_rules)

    db.commit()
    db.refresh(q)

    return schemas.QuestionOut(
        id=q.id,
        form_id=q.form_id,
        type=q.type,
        title=q.title,
        description=q.description,
        required=q.required,
        order_index=q.order_index,
        properties=parse_json_field(q.properties, {}),
        logic_rules=parse_json_field(q.logic_rules, [])
    )

def delete_question(db: Session, q_id: str) -> bool:
    q = db.query(models.Question).filter(models.Question.id == q_id).first()
    if not q:
        return False
    form_id = q.form_id
    db.delete(q)
    db.commit()

    # Re-index remaining questions
    questions = db.query(models.Question).filter(models.Question.form_id == form_id).order_by(models.Question.order_index).all()
    for idx, item in enumerate(questions):
        item.order_index = idx
    db.commit()
    return True

def reorder_questions(db: Session, form_id: str, question_ids: List[str]) -> bool:
    for idx, q_id in enumerate(question_ids):
        q = db.query(models.Question).filter(models.Question.id == q_id, models.Question.form_id == form_id).first()
        if q:
            q.order_index = idx
    db.commit()
    return True

# RESPONSES & ANSWERS CRUD
def submit_response(db: Session, form_id: str, resp_in: schemas.ResponseSubmit) -> schemas.ResponseOut:
    db_resp = models.Response(
        form_id=form_id,
        completion_time_seconds=resp_in.completion_time_seconds,
        user_agent=resp_in.user_agent
    )
    db.add(db_resp)
    db.commit()
    db.refresh(db_resp)

    answers_out = []
    for a in resp_in.answers:
        q = db.query(models.Question).filter(models.Question.id == a.question_id).first()
        val_str = dump_json_field(a.value) if isinstance(a.value, (dict, list, bool, int, float)) else str(a.value) if a.value is not None else ""
        db_ans = models.Answer(
            response_id=db_resp.id,
            question_id=a.question_id,
            value=val_str
        )
        db.add(db_ans)
        db.commit()
        db.refresh(db_ans)

        parsed_val = parse_json_field(db_ans.value, db_ans.value)
        answers_out.append(schemas.AnswerOut(
            id=db_ans.id,
            question_id=a.question_id,
            question_title=q.title if q else "Question",
            question_type=q.type if q else "unknown",
            value=parsed_val
        ))

    return schemas.ResponseOut(
        id=db_resp.id,
        form_id=db_resp.form_id,
        submitted_at=db_resp.submitted_at,
        completion_time_seconds=db_resp.completion_time_seconds,
        user_agent=db_resp.user_agent,
        answers=answers_out
    )

def get_responses(db: Session, form_id: str) -> List[schemas.ResponseOut]:
    resps = db.query(models.Response).filter(models.Response.form_id == form_id).order_by(models.Response.submitted_at.desc()).all()
    result = []
    for r in resps:
        ans_out = []
        for a in r.answers:
            q = a.question
            parsed_val = parse_json_field(a.value, a.value)
            ans_out.append(schemas.AnswerOut(
                id=a.id,
                question_id=a.question_id,
                question_title=q.title if q else "Question",
                question_type=q.type if q else "unknown",
                value=parsed_val
            ))
        result.append(schemas.ResponseOut(
            id=r.id,
            form_id=r.form_id,
            submitted_at=r.submitted_at,
            completion_time_seconds=r.completion_time_seconds,
            user_agent=r.user_agent,
            answers=ans_out
        ))
    return result

# ANALYTICS & SUMMARY STATS
def get_form_analytics(db: Session, form_id: str) -> schemas.FormAnalyticsOut:
    form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not form:
        return schemas.FormAnalyticsOut(form_id=form_id, form_title="Not Found", total_responses=0, question_stats=[])
    
    total_responses = db.query(func.count(models.Response.id)).filter(models.Response.form_id == form_id).scalar() or 0
    q_stats = []

    for q in form.questions:
        answers = db.query(models.Answer).filter(models.Answer.question_id == q.id).all()
        parsed_answers = [parse_json_field(a.value, a.value) for a in answers if a.value is not None]
        total_ans_count = len(parsed_answers)

        options_summary = None
        average_rating = None
        text_responses = None

        if q.type in ["multiple_choice", "dropdown", "yes_no"]:
            props = parse_json_field(q.properties, {})
            defined_options = props.get("options", [])
            if q.type == "yes_no":
                defined_options = ["Yes", "No"]
            
            counts = {opt: 0 for opt in defined_options}
            for val in parsed_answers:
                if isinstance(val, list):
                    for v in val:
                        s_v = str(v)
                        counts[s_v] = counts.get(s_v, 0) + 1
                else:
                    s_v = str(val)
                    counts[s_v] = counts.get(s_v, 0) + 1
            
            options_summary = [
                schemas.QuestionStatOption(
                    label=opt,
                    count=cnt,
                    percentage=round((cnt / total_ans_count * 100), 1) if total_ans_count > 0 else 0.0
                )
                for opt, cnt in counts.items()
            ]

        elif q.type == "rating":
            nums = []
            for val in parsed_answers:
                try:
                    nums.append(float(val))
                except (ValueError, TypeError):
                    pass
            if nums:
                average_rating = round(sum(nums) / len(nums), 2)
            
            # also generate rating options distribution (e.g. 1 to 5 stars)
            props = parse_json_field(q.properties, {})
            max_r = props.get("max_rating", 5)
            r_counts = {str(i): 0 for i in range(1, max_r + 1)}
            for n in nums:
                sn = str(int(n))
                if sn in r_counts:
                    r_counts[sn] += 1
            options_summary = [
                schemas.QuestionStatOption(
                    label=f"{k} Stars",
                    count=v,
                    percentage=round((v / total_ans_count * 100), 1) if total_ans_count > 0 else 0.0
                )
                for k, v in r_counts.items()
            ]

        elif q.type in ["short_text", "long_text", "email", "number"]:
            text_responses = [str(val) for val in parsed_answers if val != ""]

        q_stats.append(schemas.QuestionSummaryStat(
            question_id=q.id,
            question_title=q.title,
            question_type=q.type,
            total_answers=total_ans_count,
            options_summary=options_summary,
            average_rating=average_rating,
            text_responses=text_responses
        ))

    return schemas.FormAnalyticsOut(
        form_id=form.id,
        form_title=form.title,
        total_responses=total_responses,
        question_stats=q_stats
    )

def generate_csv_export(db: Session, form_id: str) -> str:
    form = db.query(models.Form).filter(models.Form.id == form_id).first()
    if not form:
        return ""
    
    questions = form.questions
    resps = get_responses(db, form_id)

    output = io.StringIO()
    writer = csv.writer(output)

    # Header row
    headers = ["Submission ID", "Submitted At", "Time Spent (s)"] + [q.title for q in questions]
    writer.writerow(headers)

    # Data rows
    for r in resps:
        ans_map = {a.question_id: a.value for a in r.answers}
        row = [r.id, r.submitted_at.strftime("%Y-%m-%d %H:%M:%S"), r.completion_time_seconds or ""]
        for q in questions:
            val = ans_map.get(q.id, "")
            if isinstance(val, (list, dict)):
                val = json.dumps(val)
            row.append(str(val))
        writer.writerow(row)

    return output.getvalue()
