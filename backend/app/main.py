from fastapi import FastAPI, Depends, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, crud, database, seed

# Initialize Database Tables
models.Base.metadata.create_all(bind=database.engine)

# Auto seed database on startup
db_session = database.SessionLocal()
try:
    seed.seed_database(db_session)
finally:
    db_session.close()

app = FastAPI(
    title="Typeform Clone API",
    description="Full-stack Typeform Clone REST API built with FastAPI & SQLite",
    version="1.0.0"
)

# CORS configuration to allow calls from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "app": "Typeform Clone API"}

# FORMS ENDPOINTS
@app.get("/api/forms", response_model=List[schemas.FormListOut], tags=["Forms"])
def list_forms(db: Session = Depends(database.get_db)):
    return crud.get_forms(db)

@app.post("/api/forms", response_model=schemas.FormOut, tags=["Forms"])
def create_new_form(form_in: schemas.FormCreate, db: Session = Depends(database.get_db)):
    return crud.create_form(db, form_in)

@app.get("/api/forms/{form_id}", response_model=schemas.FormOut, tags=["Forms"])
def get_form_detail(form_id: str, db: Session = Depends(database.get_db)):
    form = crud.get_form(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form

@app.put("/api/forms/{form_id}", response_model=schemas.FormOut, tags=["Forms"])
def update_form_detail(form_id: str, form_in: schemas.FormUpdate, db: Session = Depends(database.get_db)):
    form = crud.update_form(db, form_id, form_in)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form

@app.delete("/api/forms/{form_id}", tags=["Forms"])
def delete_form(form_id: str, db: Session = Depends(database.get_db)):
    success = crud.delete_form(db, form_id)
    if not success:
        raise HTTPException(status_code=404, detail="Form not found")
    return {"message": "Form deleted successfully"}

@app.post("/api/forms/{form_id}/duplicate", response_model=schemas.FormOut, tags=["Forms"])
def duplicate_form(form_id: str, db: Session = Depends(database.get_db)):
    cloned = crud.duplicate_form(db, form_id)
    if not cloned:
        raise HTTPException(status_code=404, detail="Form not found")
    return cloned

@app.post("/api/forms/{form_id}/publish", response_model=schemas.FormOut, tags=["Forms"])
def publish_form(form_id: str, db: Session = Depends(database.get_db)):
    updated = crud.update_form(db, form_id, schemas.FormUpdate(status="published"))
    if not updated:
        raise HTTPException(status_code=404, detail="Form not found")
    return updated

@app.post("/api/forms/{form_id}/unpublish", response_model=schemas.FormOut, tags=["Forms"])
def unpublish_form(form_id: str, db: Session = Depends(database.get_db)):
    updated = crud.update_form(db, form_id, schemas.FormUpdate(status="draft"))
    if not updated:
        raise HTTPException(status_code=404, detail="Form not found")
    return updated

# QUESTIONS ENDPOINTS
@app.post("/api/forms/{form_id}/questions", response_model=schemas.QuestionOut, tags=["Questions"])
def add_question(form_id: str, q_in: schemas.QuestionCreate, db: Session = Depends(database.get_db)):
    form = crud.get_form(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return crud.create_question(db, form_id, q_in)

@app.put("/api/questions/{question_id}", response_model=schemas.QuestionOut, tags=["Questions"])
def update_question(question_id: str, q_in: schemas.QuestionUpdate, db: Session = Depends(database.get_db)):
    updated = crud.update_question(db, question_id, q_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Question not found")
    return updated

@app.delete("/api/questions/{question_id}", tags=["Questions"])
def delete_question(question_id: str, db: Session = Depends(database.get_db)):
    success = crud.delete_question(db, question_id)
    if not success:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"message": "Question deleted successfully"}

@app.post("/api/forms/{form_id}/questions/reorder", tags=["Questions"])
def reorder_form_questions(form_id: str, payload: schemas.QuestionReorder, db: Session = Depends(database.get_db)):
    crud.reorder_questions(db, form_id, payload.question_ids)
    return {"message": "Questions reordered successfully"}

# PUBLIC RESPONDENT ENDPOINTS (NO AUTH REQUIRED)
@app.get("/api/forms/public/{identifier}", response_model=schemas.FormOut, tags=["Public"])
def get_public_form(identifier: str, db: Session = Depends(database.get_db)):
    form = crud.get_form_by_slug_or_id(db, identifier)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    # Return form regardless of draft status for preview, but flag in status if needed
    return form

@app.post("/api/forms/public/{form_id}/submit", response_model=schemas.ResponseOut, tags=["Public"])
def submit_public_response(form_id: str, resp_in: schemas.ResponseSubmit, db: Session = Depends(database.get_db)):
    form = crud.get_form(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return crud.submit_response(db, form_id, resp_in)

# RESULTS & ANALYTICS ENDPOINTS
@app.get("/api/forms/{form_id}/responses", response_model=List[schemas.ResponseOut], tags=["Results"])
def get_form_responses(form_id: str, db: Session = Depends(database.get_db)):
    form = crud.get_form(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return crud.get_responses(db, form_id)

@app.get("/api/forms/{form_id}/analytics", response_model=schemas.FormAnalyticsOut, tags=["Results"])
def get_form_analytics(form_id: str, db: Session = Depends(database.get_db)):
    return crud.get_form_analytics(db, form_id)

@app.get("/api/forms/{form_id}/export/csv", tags=["Results"])
def export_responses_csv(form_id: str, db: Session = Depends(database.get_db)):
    form = crud.get_form(db, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    csv_content = crud.generate_csv_export(db, form_id)
    filename = f"responses_{form.share_slug or form.id}.csv"
    return PlainTextResponse(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@app.post("/api/seed", tags=["Admin"])
def seed_db(db: Session = Depends(database.get_db)):
    seed.seed_database(db)
    return {"message": "Database seeded"}
