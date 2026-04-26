"""initial schema: users, progress, quiz_results

Revision ID: 0001_initial
Revises:
Create Date: 2026-04-26
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("username", sa.String(), nullable=False),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "progress",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("section", sa.String(), nullable=False),
        sa.Column("completed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["user_id"], ["users.id"], ondelete="CASCADE", name="fk_progress_user_id"
        ),
        sa.UniqueConstraint("user_id", "section", name="uq_user_section"),
    )
    op.create_index("ix_progress_user_id", "progress", ["user_id"])

    op.create_table(
        "quiz_results",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("question_id", sa.String(), nullable=False),
        sa.Column("selected", sa.String(), nullable=False),
        sa.Column("is_correct", sa.Boolean(), nullable=False),
        sa.Column("score", sa.Integer(), nullable=False),
        sa.Column(
            "submitted_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["user_id"], ["users.id"], ondelete="CASCADE", name="fk_quiz_results_user_id"
        ),
    )
    op.create_index("ix_quiz_results_user_id", "quiz_results", ["user_id"])
    op.create_index(
        "ix_quiz_results_user_submitted",
        "quiz_results",
        ["user_id", "submitted_at"],
    )


def downgrade() -> None:
    op.drop_index("ix_quiz_results_user_submitted", table_name="quiz_results")
    op.drop_index("ix_quiz_results_user_id", table_name="quiz_results")
    op.drop_table("quiz_results")

    op.drop_index("ix_progress_user_id", table_name="progress")
    op.drop_table("progress")

    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
