from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from passlib.apps import custom_app_context as pwd_context
from datetime import datetime
from settings import *
from sqlalchemy import desc

# from hashlib import new
# from werkzeug.security import generate_password_hash, check_password_hash
# from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired)

db = SQLAlchemy(app)

class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    username = db.Column(db.String(32), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    investments = db.relationship("Investment", backref="user")
    portfolio_value = db.relationship("PortfolioValue", backref="user")

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def json(self):
        return {"id": self.id,
                "name": self.name,
                "username": self.username,
                # "investments": Investment.json(Investment.get_all_investments_by_user(self.id)),
                # "portfolio_value": PortfolioValue.get_by_user(self.id)
        }

    def get_all():
        return [User.json(user) for user in User.query.all()]

    def get_by_id(_id):
        return User.json(User.query.filter_by(id=_id).first())
    
    def get_by_username(_username):
        return User.json(User.query.filter_by(username=_username).first())

    def get_instance_by_username(_username):
        return User.query.filter_by(username=_username).first()


class PortfolioValue(db.Model):
    __tablename__ = "portfolio_values"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    value = db.Column(db.Float)
    date = db.Column(db.DateTime, default=datetime.now)

    def json(self):
        return {"id": self.id,
                "user_id": self.user_id,
                "value": self.value,
                "date": self.date,
        }

    def get_all():
        return [PortfolioValue.json(pv) for pv in PortfolioValue.query.all()]

    def add_portfolio_value(user_id, value):
        new_pf = PortfolioValue(user_id=user_id, value=value, date=datetime.now())
        db.session.add(new_pf)
        db.session.commit()
    
    def get_all_by_user_id(_user_id):
        return [PortfolioValue.json(pv) for pv in PortfolioValue.query.filter_by(user_id=_user_id).order_by(desc("date"))]

    def get_last_by_user(_user_id):
        return PortfolioValue.json(PortfolioValue.query.filter_by(user_id=_user_id).order_by(desc("date")).first())


class Investment(db.Model):
    __tablename__ = "investments"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    short_name_handle = db.Column(db.String)
    date = db.Column(db.DateTime, default=datetime.now)
    price = db.Column(db.Float)
    amount = db.Column(db.Float)
    value = db.Column(db.Float)
    deleted = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    #"date": self.date,
    def json(self):
        return {"id": self.id,
                "name": self.name,
                "short_name_handle": self.short_name_handle,
                "price": self.price,
                "amount": self.amount,
                "value": self.value,
        }

    def add_investment(name, short_name_handle, price, amount, _user_id):
        new_investment = Investment(name=name, short_name_handle=short_name_handle, amount=amount, date=datetime.now(), price=price, value=price*amount, user_id=_user_id)
        db.session.add(new_investment)
        db.session.commit()

    def get_all_by_user_id(_user_id):
        return [Investment.json(investment) for investment in Investment.query.filter_by(user_id=_user_id, deleted=False)]

    def get_by_id(_id):
        return Investment.json(Investment.query.filter_by(id=_id).first())

    # todo: write this method so that it accepts key-value pairs
    def update_investment(_id, _name, _short_name_handle, _price, _amount):
        investment_to_update = Investment.query.filter_by(id=_id).first()
        investment_to_update.name = _name
        investment_to_update.short_name_handle = _short_name_handle
        investment_to_update.date = datetime.now()
        investment_to_update.price = _price
        investment_to_update.amount = _amount
        investment_to_update.value = _price*_amount
        db.session.commit()

    def delete_investment(_id):
        investment_to_delete = Investment.query.filter_by(id=_id).first()
        investment_to_delete.deleted = True
        db.session.commit()
