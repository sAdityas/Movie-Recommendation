from models.database import Ticket, db

from main import app

with app.app_context():
    db.create_all()

    db1 = Ticket(
        id=1,
        title='Sinners',
        time='11:30',
        seats=['B12','B13'],
        bookingId = '21AA1W34F7C'
    )

    db.session.add(db1)
    db.session.commit()
    print("Done")
