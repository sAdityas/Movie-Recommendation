from models.database import Ticket, db
from models.users import User

from main import app

with app.app_context():
    db.drop_all()
    db.create_all()

    db1 = Ticket(
        id=1,
        title='Sinners',
        time='11:30',
        seats=['Right-H2','Right-H3'],
        bookingId = '21AA1W34F7C',
        userid = 1,
        price = 250,
    )

    db2 = User(
        id = 1,
        firstname = 'Aditya',
        lastname = 'Sarkale',
        email = 'adisarkale@test.com',
        passwd = 'scrypt:32768:8:1$ZOXQ1DltHqCOgZbu$2304184c8ce3924d9a111d6661bb24e263980d4489d7cccd84c5a34e53b827ba8b575c20dbe550e5c1a3641d8f78d1f26300671214499954d797c23b14f11a30',
    )
    db.session.add(db2)
    db.session.add(db1)
    db.session.commit()
    print("Done")
