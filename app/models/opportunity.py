
from app import db
from datetime import datetime

# Association table for many-to-many relationship between opportunities and tags
opportunity_tags = db.Table('opportunity_tags',
    db.Column('opportunity_id', db.Integer, db.ForeignKey('funding_opportunities.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)

class Organization(db.Model):
    __tablename__ = 'organizations'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    country = db.Column(db.String(100))
    website = db.Column(db.String(255))
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    opportunities = db.relationship('FundingOpportunity', backref='organization_ref', lazy='dynamic') # Changed backref name

class ResearchArea(db.Model):
    __tablename__ = 'research_areas'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text)
    opportunities = db.relationship('FundingOpportunity', backref='research_area_ref', lazy='dynamic') # Changed backref name

class Tag(db.Model):
    __tablename__ = 'tags'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)

class FundingOpportunity(db.Model):
    __tablename__ = 'funding_opportunities'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    country = db.Column(db.String(100))
    amount_min = db.Column(db.Integer)
    amount_max = db.Column(db.Integer)
    currency = db.Column(db.String(10), default='USD')
    deadline = db.Column(db.Date)
    research_area_id = db.Column(db.Integer, db.ForeignKey('research_areas.id'))
    description = db.Column(db.Text)
    eligibility_criteria = db.Column(db.Text)
    application_url = db.Column(db.String(500))
    status = db.Column(db.String(50), default='active') # e.g., active, closed, upcoming
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    tags = db.relationship('Tag', secondary=opportunity_tags,
                           lazy='subquery', backref=db.backref('opportunities', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'organization': self.organization_ref.name if self.organization_ref else None,
            'country': self.country,
            'amount_min': self.amount_min,
            'amount_max': self.amount_max,
            'currency': self.currency,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'research_area': self.research_area_ref.name if self.research_area_ref else None,
            'description': self.description,
            'eligibility_criteria': self.eligibility_criteria,
            'application_url': self.application_url,
            'status': self.status,
            'tags': [tag.name for tag in self.tags],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
