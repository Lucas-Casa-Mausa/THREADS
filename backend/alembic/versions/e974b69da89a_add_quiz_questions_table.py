"""Add quiz_questions table

Revision ID: e974b69da89a
Revises: 0001_initial
Create Date: 2026-08-17 13:50:21

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'e974b69da89a'
down_revision = '0001_initial'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        'quiz_questions',
        sa.Column('id', sa.String(), primary_key=True, nullable=False),
        sa.Column('question', sa.String(), nullable=False),
        sa.Column('options', sa.JSON(), nullable=False),
        sa.Column('correct', sa.String(), nullable=False),
        sa.Column('feedback', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    )

def downgrade() -> None:
    op.drop_table('quiz_questions')
