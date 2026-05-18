#!/bin/bash

# Script para commitar e fazer merge das mudanças do dashboard

cd "c:\Users\202403660059\OneDrive - Educacional\Documentos\GitHub\TvElos.worktrees\agents-dashboard-admin-panel-artifacts"

echo "=== Verificando status ==="
git status --short

echo ""
echo "=== Adicionando arquivos ==="
git add .

echo ""
echo "=== Fazendo commit ==="
git commit -m "feat: Add admin dashboard with metrics and charts" \
  -m "- Implement comprehensive metrics dashboard in painel.html
- Add 4 metric cards (Total, Aprovadas, Usuários, Vídeos)
- Add bar chart for monthly evolution
- Add progress bars for current status
- Add activity feed with 5 recent items
- Implement responsive design (mobile, tablet, desktop)
- Add CSS styling with TV ELOS color scheme
- Integrate with /api/admin/stats endpoint
- Create dashboard preview standalone file
- Add complete documentation (5 markdown files)
- Dashboard visible only to admin/editor users

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo ""
echo "=== Commit concluído ==="
git log --oneline -1
