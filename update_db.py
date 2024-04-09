from main import db, app
from main import User, Session

with app.app_context():
    db.drop_all()
    db.create_all()