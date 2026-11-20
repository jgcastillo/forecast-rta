"""extend_products_table_us05a

Revision ID: 6483685c7578
Revises: e0faaded3e73
Create Date: 2026-11-20 00:39:04.653066

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel

# revision identifiers, used by Alembic.
revision: str = '6483685c7578'
down_revision: Union[str, Sequence[str], None] = 'e0faaded3e73'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('products', sa.Column('mps_per_box', sa.Integer(), nullable=True))
    op.add_column('products', sa.Column('category_type', sqlmodel.sql.sqltypes.AutoString(length=50), nullable=True))
    op.add_column('products', sa.Column('press_model', sqlmodel.sql.sqltypes.AutoString(length=50), nullable=True))
    op.add_column('products', sa.Column('notes', sqlmodel.sql.sqltypes.AutoString(), nullable=True))
    op.add_column('products', sa.Column('updated_at', sa.DateTime(), nullable=True))
    op.create_check_constraint('check_mps_per_box_positive', 'products', 'mps_per_box IS NULL OR mps_per_box > 0')
    op.create_check_constraint('check_shipping_route_valid', 'products', "shipping_route IN ('Marítimo', 'Aéreo', 'Maritime', 'Air', 'MARITIME', 'AIR')")


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('check_shipping_route_valid', 'products', type_='check')
    op.drop_constraint('check_mps_per_box_positive', 'products', type_='check')
    op.drop_column('products', 'updated_at')
    op.drop_column('products', 'notes')
    op.drop_column('products', 'press_model')
    op.drop_column('products', 'category_type')
    op.drop_column('products', 'mps_per_box')
