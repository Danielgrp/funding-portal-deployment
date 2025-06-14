
from flask import Blueprint, jsonify, request
from app.models import FundingOpportunity, Organization, ResearchArea, Tag
from app import db
from sqlalchemy import or_, and_, func
<<<<<<< HEAD
=======
from .sample_data import generate_sample_opportunities, get_sample_filters, populate_db_with_sample_data
>>>>>>> ff9a10e (Flattened project structure for Render deployment)

api_bp = Blueprint('api', __name__)

@api_bp.route('/statistics', methods=['GET'])
def get_statistics():
    active_opportunities = FundingOpportunity.query.filter_by(status='active').count()
<<<<<<< HEAD
    total_funding_query = db.session.query(func.sum(FundingOpportunity.amount_max)).filter(FundingOpportunity.status=='active').scalar()
    total_funding = total_funding_query if total_funding_query else 0
    countries = db.session.query(FundingOpportunity.country).filter(FundingOpportunity.status=='active').distinct().count()
    funding_sources = db.session.query(Organization.id).distinct().count() # Counts distinct organizations with opportunities
    
    # Simulate the 52 opportunities and $65.1M if DB is empty for demo
=======
    total_funding_query = db.session.query(func.sum(FundingOpportunity.amount_max)).filter(FundingOpportunity.status == 'active').scalar()
    total_funding = total_funding_query if total_funding_query else 0
    countries = db.session.query(FundingOpportunity.country).filter(FundingOpportunity.status == 'active').distinct().count()
    funding_sources = db.session.query(Organization.id).distinct().count()

>>>>>>> ff9a10e (Flattened project structure for Render deployment)
    if active_opportunities == 0:
        return jsonify({
            'active_opportunities': 52,
            'total_funding': 65100000,
<<<<<<< HEAD
            'countries': 8, # Example number
            'funding_sources': 10 # Example number
=======
            'countries': 8,
            'funding_sources': 10
>>>>>>> ff9a10e (Flattened project structure for Render deployment)
        })

    return jsonify({
        'active_opportunities': active_opportunities,
        'total_funding': total_funding,
        'countries': countries,
        'funding_sources': funding_sources
    })

@api_bp.route('/opportunities', methods=['GET'])
<<<<<<< HEAD
def get_opportunities_route(): # Renamed to avoid conflict
=======
def get_opportunities_route():
>>>>>>> ff9a10e (Flattened project structure for Render deployment)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    query = FundingOpportunity.query.filter_by(status='active')
<<<<<<< HEAD
    
    # Add search and filter capabilities from /search endpoint for consistency
=======

>>>>>>> ff9a10e (Flattened project structure for Render deployment)
    keyword = request.args.get('keyword', '').strip().lower()
    country_filter = request.args.get('country', '').strip()
    organization_filter = request.args.get('organization', '').strip()
    research_area_filter = request.args.get('research_area', '').strip()
    min_amount_filter = request.args.get('min_amount', type=int)
    max_amount_filter = request.args.get('max_amount', type=int)
    tags_filter = request.args.get('tags', '').strip()

    if keyword:
        query = query.filter(or_(
            FundingOpportunity.title.ilike(f'%{keyword}%'),
            FundingOpportunity.description.ilike(f'%{keyword}%'),
            FundingOpportunity.organization_ref.has(Organization.name.ilike(f'%{keyword}%'))
        ))
<<<<<<< HEAD
    if country_filter:
        query = query.filter(FundingOpportunity.country.ilike(f'%{country_filter}%'))
    if organization_filter:
        query = query.join(Organization, FundingOpportunity.organization_ref).
            filter(Organization.name.ilike(f'%{organization_filter}%'))
    if research_area_filter:
        query = query.join(ResearchArea, FundingOpportunity.research_area_ref).
            filter(ResearchArea.name.ilike(f'%{research_area_filter}%'))
    if min_amount_filter is not None:
        query = query.filter(FundingOpportunity.amount_max >= min_amount_filter) # or amount_min, depending on logic
    if max_amount_filter is not None:
        query = query.filter(FundingOpportunity.amount_min <= max_amount_filter) # or amount_max
=======

    if country_filter:
        query = query.filter(FundingOpportunity.country.ilike(f'%{country_filter}%'))

    if organization_filter:
        query = query.join(Organization, FundingOpportunity.organization_ref).filter(
            Organization.name.ilike(f'%{organization_filter}%')
        )

    if research_area_filter:
        query = query.join(ResearchArea, FundingOpportunity.research_area_ref).filter(
            ResearchArea.name.ilike(f'%{research_area_filter}%')
        )

    if min_amount_filter is not None:
        query = query.filter(FundingOpportunity.amount_max >= min_amount_filter)

    if max_amount_filter is not None:
        query = query.filter(FundingOpportunity.amount_min <= max_amount_filter)

>>>>>>> ff9a10e (Flattened project structure for Render deployment)
    if tags_filter:
        tag_names = [tag.strip() for tag in tags_filter.split(',')]
        query = query.join(FundingOpportunity.tags).filter(Tag.name.in_(tag_names))

<<<<<<< HEAD
    pagination = query.order_by(FundingOpportunity.deadline.asc().nullslast(), FundingOpportunity.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    opportunities_data = [opp.to_dict() for opp in pagination.items]
    
    # Simulate 52 opportunities if DB is empty for demo
    if not opportunities_data and pagination.total == 0:
        from .sample_data import generate_sample_opportunities # Assuming sample_data.py exists
=======
    pagination = query.order_by(
        FundingOpportunity.deadline.asc().nullslast(),
        FundingOpportunity.created_at.desc()
    ).paginate(page=page, per_page=per_page, error_out=False)

    opportunities_data = [opp.to_dict() for opp in pagination.items]

    if not opportunities_data and pagination.total == 0:
>>>>>>> ff9a10e (Flattened project structure for Render deployment)
        opportunities_data = generate_sample_opportunities(52)
        return jsonify({
            'opportunities': opportunities_data,
            'total': 52,
<<<<<<< HEAD
            'pages': (52 + per_page -1) // per_page,
=======
            'pages': (52 + per_page - 1) // per_page,
>>>>>>> ff9a10e (Flattened project structure for Render deployment)
            'current_page': page,
            'is_sample_data': True
        })

    return jsonify({
        'opportunities': opportunities_data,
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })

@api_bp.route('/filters', methods=['GET'])
def get_filter_options():
    countries = sorted([c[0] for c in db.session.query(FundingOpportunity.country).distinct().all() if c[0]])
    organizations = sorted([o[0] for o in db.session.query(Organization.name).distinct().all() if o[0]])
    research_areas = sorted([ra[0] for ra in db.session.query(ResearchArea.name).distinct().all() if ra[0]])
    tags = sorted([t[0] for t in db.session.query(Tag.name).distinct().all() if t[0]])
<<<<<<< HEAD
    
    # Simulate if DB is empty
    if not countries and not organizations and not research_areas:
        from .sample_data import get_sample_filters
=======

    if not countries and not organizations and not research_areas:
>>>>>>> ff9a10e (Flattened project structure for Render deployment)
        sample_filters = get_sample_filters()
        return jsonify(sample_filters)

    return jsonify({
        'countries': countries,
        'organizations': organizations,
        'research_areas': research_areas,
        'tags': tags
    })

<<<<<<< HEAD
# Sample data generation (should be in a separate file ideally, e.g., app/routes/sample_data.py)
# For simplicity, adding it here. In a real app, this would be more robust.
@api_bp.route('/_populate_sample_data', methods=['POST'])
def populate_sample_data_route():
    from .sample_data import populate_db_with_sample_data
=======
@api_bp.route('/_populate_sample_data', methods=['POST'])
def populate_sample_data_route():
>>>>>>> ff9a10e (Flattened project structure for Render deployment)
    try:
        populate_db_with_sample_data(db)
        return jsonify({'message': 'Sample data populated successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
<<<<<<< HEAD

=======
>>>>>>> ff9a10e (Flattened project structure for Render deployment)
