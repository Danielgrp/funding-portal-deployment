
import random
from datetime import datetime, timedelta
from app.models import FundingOpportunity, Organization, ResearchArea, Tag

def get_sample_filters():
    return {
        'countries': ['United States', 'United Kingdom', 'Canada', 'Germany', 'Australia', 'European Union', 'Global', 'France'],
        'organizations': ['National Institutes of Health', 'Wellcome Trust', 'National Science Foundation', 'European Research Council', 'Gates Foundation', 'Alfred P. Sloan Foundation', 'Simons Foundation', 'Chan Zuckerberg Initiative'],
        'research_areas': ['Biomedical Sciences', 'Life Sciences', 'STEM', 'All Fields', 'Global Health', 'Computer Science', 'Physics', 'Environmental Science'],
        'tags': ['Early Career', 'Fellowship', 'Research Grant', 'Travel Grant', 'Seed Funding']
    }

def generate_sample_opportunities(count=52):
    sample_filters = get_sample_filters()
    opportunities = []
    for i in range(1, count + 1):
        org_name = random.choice(sample_filters['organizations'])
        research_area_name = random.choice(sample_filters['research_areas'])
        country_name = random.choice(sample_filters['countries'])
        
        deadline_date = datetime.now() + timedelta(days=random.randint(30, 365))
        amount = random.choice([50000, 100000, 250000, 500000, 1000000, 1500000, 2000000])
        
        opp = {
            'id': i,
            'title': f'Sample Grant {i} for {research_area_name}',
            'organization': org_name,
            'country': country_name,
            'amount_min': amount * 0.8 if random.random() > 0.5 else None,
            'amount_max': amount,
            'currency': 'USD',
            'deadline': deadline_date.isoformat(),
            'research_area': research_area_name,
            'description': f'This is a sample description for grant {i} focusing on {research_area_name} by {org_name}.',
            'eligibility_criteria': 'Must be an eligible researcher or institution.',
            'application_url': f'https://example.com/grant/{i}',
            'status': 'active',
            'tags': random.sample(sample_filters['tags'], k=random.randint(1,3)),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        opportunities.append(opp)
    return opportunities

def populate_db_with_sample_data(db_instance):
    sample_filters = get_sample_filters()
    
    # Create Organizations
    org_objects = {}
    for name in sample_filters['organizations']:
        org = Organization.query.filter_by(name=name).first()
        if not org:
            org = Organization(name=name, country=random.choice(sample_filters['countries']))
            db_instance.session.add(org)
        org_objects[name] = org

    # Create Research Areas
    ra_objects = {}
    for name in sample_filters['research_areas']:
        ra = ResearchArea.query.filter_by(name=name).first()
        if not ra:
            ra = ResearchArea(name=name)
            db_instance.session.add(ra)
        ra_objects[name] = ra

    # Create Tags
    tag_objects = {}
    for name in sample_filters['tags']:
        tag = Tag.query.filter_by(name=name).first()
        if not tag:
            tag = Tag(name=name)
            db_instance.session.add(tag)
        tag_objects[name] = tag
    
    db_instance.session.commit() # Commit orgs, RAs, tags to get IDs

    # Create Funding Opportunities
    sample_opps = generate_sample_opportunities(52)
    for opp_data in sample_opps:
        existing_opp = FundingOpportunity.query.filter_by(title=opp_data['title']).first()
        if existing_opp:
            continue

        new_opp = FundingOpportunity(
            title=opp_data['title'],
            organization_id=org_objects[opp_data['organization']].id,
            country=opp_data['country'],
            amount_min=opp_data.get('amount_min'),
            amount_max=opp_data['amount_max'],
            currency=opp_data['currency'],
            deadline=datetime.fromisoformat(opp_data['deadline'].split('T')[0]), # Ensure date only
            research_area_id=ra_objects[opp_data['research_area']].id,
            description=opp_data['description'],
            eligibility_criteria=opp_data['eligibility_criteria'],
            application_url=opp_data['application_url'],
            status=opp_data['status']
        )
        for tag_name in opp_data['tags']:
            new_opp.tags.append(tag_objects[tag_name])
        db_instance.session.add(new_opp)

    db_instance.session.commit()
