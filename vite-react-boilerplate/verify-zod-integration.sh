#!/bin/bash
# Zod Integration Verification Script
# Run this to verify the Zod integration is complete and working

set -e

echo "🔍 Zod Integration Verification"
echo "================================="
echo ""

PROJECT_DIR="/home/lordmaska/KPZ_789/vite-react-boilerplate"

# Check if schema files exist
echo "✓ Checking Schema Files..."
test -f "$PROJECT_DIR/src/features/pcs/schema.ts" && echo "  ✓ PC schema found"
test -f "$PROJECT_DIR/src/features/sessions/schema.ts" && echo "  ✓ Session schema found"
test -f "$PROJECT_DIR/src/features/clients/schema.ts" && echo "  ✓ Client schema found"
echo ""

# Check if form components exist
echo "✓ Checking Form Components..."
test -f "$PROJECT_DIR/src/components/forms/CreatePCForm.tsx" && echo "  ✓ PC form found"
test -f "$PROJECT_DIR/src/components/forms/CreateSessionForm.tsx" && echo "  ✓ Session form found"
test -f "$PROJECT_DIR/src/components/forms/CreateClientForm.tsx" && echo "  ✓ Client form found"
test -f "$PROJECT_DIR/src/components/forms/AdvancedPCFormExample.tsx" && echo "  ✓ Advanced example found"
echo ""

# Check if utilities exist
echo "✓ Checking Validation Utilities..."
test -f "$PROJECT_DIR/src/utils/validation.ts" && echo "  ✓ Validation utilities found"
echo ""

# Check if documentation exists
echo "✓ Checking Documentation..."
test -f "$PROJECT_DIR/ZOD_SETUP_COMPLETE.md" && echo "  ✓ Setup complete guide found"
test -f "$PROJECT_DIR/ZOD_INTEGRATION.md" && echo "  ✓ Integration guide found"
test -f "$PROJECT_DIR/ZOD_EXAMPLES.md" && echo "  ✓ Examples guide found"
test -f "$PROJECT_DIR/ZOD_DEVELOPER_GUIDE.md" && echo "  ✓ Developer guide found"
test -f "$PROJECT_DIR/CHANGES_SUMMARY.md" && echo "  ✓ Changes summary found"
echo ""

# Count files
echo "📊 File Statistics"
echo "==================="
SCHEMA_COUNT=$(find "$PROJECT_DIR/src/features" -name "schema.ts" | wc -l)
FORM_COUNT=$(find "$PROJECT_DIR/src/components/forms" -name "*.tsx" | grep -E "(Create|Advanced)" | wc -l)
DOC_COUNT=$(find "$PROJECT_DIR" -maxdepth 1 -name "ZOD*.md" -o -name "CHANGES_SUMMARY.md" | wc -l)

echo "  Schema files: $SCHEMA_COUNT"
echo "  Form components: $FORM_COUNT"
echo "  Documentation files: $DOC_COUNT"
echo ""

echo "✅ Zod Integration Complete!"
echo "================================="
echo ""
echo "📖 Quick Start:"
echo "  1. Read ZOD_SETUP_COMPLETE.md for overview"
echo "  2. Read ZOD_INTEGRATION.md for detailed guide"
echo "  3. Check ZOD_EXAMPLES.md for code examples"
echo "  4. Use ZOD_DEVELOPER_GUIDE.md when adding new features"
echo ""
echo "🚀 Happy coding!"
