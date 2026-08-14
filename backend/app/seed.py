from sqlalchemy.orm import Session
from . import models, database, crud, schemas
import json

def seed_database(db: Session):
    # Check if database already has forms
    existing_forms_count = db.query(models.Form).count()
    if existing_forms_count > 0:
        print("Database already contains forms. Skipping seed.")
        return

    print("Seeding database with sample forms and responses...")

    # Form 1: Product Feedback Survey
    f1 = models.Form(
        title="Product Feedback & NPS Survey",
        description="Help us make our Typeform Clone experience exceptional by sharing your thoughts.",
        status="published",
        share_slug="product-feedback-nps",
        theme_config=json.dumps({
            "primary_color": "#047857",
            "background_color": "#F0FDF4",
            "text_color": "#064E3B",
            "font_family": "Inter"
        }),
        thank_you_title="Thank you for your valuable feedback!",
        thank_you_message="Your response helps us continuously refine and improve our product."
    )
    db.add(f1)
    db.commit()

    q1_1 = models.Question(
        form_id=f1.id,
        type="short_text",
        title="What is your full name?",
        description="So we know who to address when following up.",
        required=True,
        order_index=0,
        properties=json.dumps({"placeholder": "Jane Doe"})
    )
    q1_2 = models.Question(
        form_id=f1.id,
        type="email",
        title="What is your email address?",
        description="We'll never send spam.",
        required=True,
        order_index=1,
        properties=json.dumps({"placeholder": "jane@company.com"})
    )
    q1_3 = models.Question(
        form_id=f1.id,
        type="multiple_choice",
        title="Which feature do you use most frequently?",
        description="Select the capability most core to your workflow.",
        required=True,
        order_index=2,
        properties=json.dumps({
            "options": ["Form Builder & Live Preview", "Conversational Respondent Flow", "Analytics & CSV Export", "Custom Styling & Themes"]
        })
    )
    q1_4 = models.Question(
        form_id=f1.id,
        type="rating",
        title="How would you rate your overall experience?",
        description="1 = Unsatisfied, 5 = Highly Satisfied",
        required=True,
        order_index=3,
        properties=json.dumps({"max_rating": 5, "rating_shape": "star"})
    )
    q1_5 = models.Question(
        form_id=f1.id,
        type="yes_no",
        title="Would you recommend our platform to a colleague?",
        description="Word-of-mouth is our primary growth channel.",
        required=True,
        order_index=4,
        properties=json.dumps({})
    )
    q1_6 = models.Question(
        form_id=f1.id,
        type="long_text",
        title="Any additional thoughts or feature requests?",
        description="Feel free to share any constructive feedback or missing features.",
        required=False,
        order_index=5,
        properties=json.dumps({"placeholder": "I would love to see..."})
    )
    db.add_all([q1_1, q1_2, q1_3, q1_4, q1_5, q1_6])
    db.commit()

    # Seed Responses for Form 1
    sample_responses_f1 = [
        {
            "answers": [
                {"question_id": q1_1.id, "value": "Alex Rivera"},
                {"question_id": q1_2.id, "value": "alex.rivera@techcorp.io"},
                {"question_id": q1_3.id, "value": "Form Builder & Live Preview"},
                {"question_id": q1_4.id, "value": 5},
                {"question_id": q1_5.id, "value": "Yes"},
                {"question_id": q1_6.id, "value": "The 1-question-at-a-time transition is buttery smooth! Would love AI auto-generation of questions."}
            ],
            "completion_time_seconds": 45
        },
        {
            "answers": [
                {"question_id": q1_1.id, "value": "Sarah Chen"},
                {"question_id": q1_2.id, "value": "sarah@designlab.co"},
                {"question_id": q1_3.id, "value": "Conversational Respondent Flow"},
                {"question_id": q1_4.id, "value": 5},
                {"question_id": q1_5.id, "value": "Yes"},
                {"question_id": q1_6.id, "value": "Love the custom theme customization and keyboard shortcuts."}
            ],
            "completion_time_seconds": 38
        },
        {
            "answers": [
                {"question_id": q1_1.id, "value": "Marcus Vance"},
                {"question_id": q1_2.id, "value": "marcus.vance@startup.org"},
                {"question_id": q1_3.id, "value": "Analytics & CSV Export"},
                {"question_id": q1_4.id, "value": 4},
                {"question_id": q1_5.id, "value": "Yes"},
                {"question_id": q1_6.id, "value": "CSV export works great. Keep up the good work!"}
            ],
            "completion_time_seconds": 52
        },
        {
            "answers": [
                {"question_id": q1_1.id, "value": "Elena Rostova"},
                {"question_id": q1_2.id, "value": "elena@acme.com"},
                {"question_id": q1_3.id, "value": "Custom Styling & Themes"},
                {"question_id": q1_4.id, "value": 4},
                {"question_id": q1_5.id, "value": "Yes"},
                {"question_id": q1_6.id, "value": "Very sleek design. Exactly like original Typeform."}
            ],
            "completion_time_seconds": 60
        }
    ]

    for resp in sample_responses_f1:
        crud.submit_response(
            db=db,
            form_id=f1.id,
            resp_in=schemas.ResponseSubmit(
                answers=[schemas.AnswerSubmit(**a) for a in resp["answers"]],
                completion_time_seconds=resp["completion_time_seconds"],
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0"
            )
        )

    # Form 2: Tech Summit 2026 Registration
    f2 = models.Form(
        title="Tech Summit 2026 Registration",
        description="Reserve your slot for the premier software architecture & AI summit.",
        status="published",
        share_slug="tech-summit-2026",
        theme_config=json.dumps({
            "primary_color": "#1D4ED8",
            "background_color": "#EFF6FF",
            "text_color": "#1E3A8A",
            "font_family": "Inter"
        }),
        thank_you_title="Registration Confirmed!",
        thank_you_message="We've emailed your badge details. See you at Tech Summit 2026!"
    )
    db.add(f2)
    db.commit()

    q2_1 = models.Question(
        form_id=f2.id,
        type="short_text",
        title="Full Name",
        required=True,
        order_index=0,
        properties=json.dumps({"placeholder": "Michael Scott"})
    )
    q2_2 = models.Question(
        form_id=f2.id,
        type="email",
        title="Work Email",
        required=True,
        order_index=1,
        properties=json.dumps({"placeholder": "michael@dundermifflin.com"})
    )
    q2_3 = models.Question(
        form_id=f2.id,
        type="dropdown",
        title="Which track are you most excited about?",
        required=True,
        order_index=2,
        properties=json.dumps({
            "options": ["Frontend & Modern Frameworks", "Backend Systems & Databases", "AI & Autonomous Agents", "Cloud Infrastructure"]
        })
    )
    q2_4 = models.Question(
        form_id=f2.id,
        type="number",
        title="How many team members will join with you?",
        required=False,
        order_index=3,
        properties=json.dumps({"placeholder": "0"})
    )
    q2_5 = models.Question(
        form_id=f2.id,
        type="yes_no",
        title="Will you attend the VIP Speaker Networking Dinner?",
        required=True,
        order_index=4,
        properties=json.dumps({})
    )
    db.add_all([q2_1, q2_2, q2_3, q2_4, q2_5])
    db.commit()

    sample_responses_f2 = [
        {
            "answers": [
                {"question_id": q2_1.id, "value": "David Wallace"},
                {"question_id": q2_2.id, "value": "dwallace@dundermifflin.com"},
                {"question_id": q2_3.id, "value": "AI & Autonomous Agents"},
                {"question_id": q2_4.id, "value": 3},
                {"question_id": q2_5.id, "value": "Yes"}
            ],
            "completion_time_seconds": 30
        },
        {
            "answers": [
                {"question_id": q2_1.id, "value": "Jim Halpert"},
                {"question_id": q2_2.id, "value": "jhalpert@dundermifflin.com"},
                {"question_id": q2_3.id, "value": "Frontend & Modern Frameworks"},
                {"question_id": q2_4.id, "value": 1},
                {"question_id": q2_5.id, "value": "Yes"}
            ],
            "completion_time_seconds": 25
        }
    ]

    for resp in sample_responses_f2:
        crud.submit_response(
            db=db,
            form_id=f2.id,
            resp_in=schemas.ResponseSubmit(
                answers=[schemas.AnswerSubmit(**a) for a in resp["answers"]],
                completion_time_seconds=resp["completion_time_seconds"]
            )
        )

    # Form 3: New Client Intake (Draft)
    f3 = models.Form(
        title="New Client Intake Form",
        description="Draft form for gathering new project scope requirements.",
        status="draft",
        share_slug="client-intake-draft",
        theme_config=json.dumps({
            "primary_color": "#262626",
            "background_color": "#FFFFFF",
            "text_color": "#191919",
            "font_family": "Inter"
        })
    )
    db.add(f3)
    db.commit()

    q3_1 = models.Question(
        form_id=f3.id,
        type="short_text",
        title="Company / Organization Name",
        required=True,
        order_index=0,
        properties=json.dumps({"placeholder": "Acme Corp"})
    )
    q3_2 = models.Question(
        form_id=f3.id,
        type="dropdown",
        title="Estimated Budget Range",
        required=True,
        order_index=1,
        properties=json.dumps({
            "options": ["$5k - $15k", "$15k - $50k", "$50k - $100k", "$100k+"]
        })
    )
    db.add_all([q3_1, q3_2])
    db.commit()

    print("Database seeding completed successfully.")
