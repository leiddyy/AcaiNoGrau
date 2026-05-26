Instruções para adicionar Secrets no GitHub e conectar ao Railway/Render

1) Criar secrets pelo painel do GitHub (recomendado):
- Vá em Settings → Secrets and variables → Actions → New repository secret
- Adicione os seguintes (valores obtidos no painel da plataforma):
  - RENDER_API_KEY: chave API da Render (Service Account)
  - RENDER_SERVICE_ID: ID do serviço Render a ser deployado
  - RAILWAY_API_KEY: chave API do Railway (opcional)
  - DATABASE_URL: string de conexão do Supabase (use a role com permissão)
  - SUPABASE_SERVICE_ROLE_KEY: (opcional para operações server-side)

2) Ou usar a `gh` CLI (exemplo):
```bash
# instalar GitHub CLI: https://cli.github.com/
gh auth login
gh secret set RENDER_API_KEY --body "<your-render-api-key>"
gh secret set RENDER_SERVICE_ID --body "<your-render-service-id>"
gh secret set RAILWAY_API_KEY --body "<your-railway-api-key>"
gh secret set DATABASE_URL --body "postgresql://USER:PASS@HOST:PORT/DB"
gh secret set SUPABASE_SERVICE_ROLE_KEY --body "<supabase-service-role-key>"
```

3) Conectar repositório ao serviço de deploy:
- Render: criar novo "Web Service" → conectar GitHub repo → configurar branch `main` → definir build & start (use `npm start`/Procfile) → prover os secrets em Environment.
- Railway: criar novo projeto e escolher GitHub repo ou usar Railway CLI (`railway up`) e adicionar `RAILWAY_API_KEY` como secret.

4) Cloudflare Pages (frontend):
- Criar projeto no Cloudflare Pages e conectar ao repo. Defina variáveis de ambiente (ex.: `VITE_API_URL`) se necessário.

5) Segurança e boas práticas:
- Nunca coloque chaves reais em código ou em `package.json`.
- Use `SUPABASE_SERVICE_ROLE_KEY` apenas no backend (não expor ao cliente).

Se quiser, eu posso:
- Gerar os comandos `gh secret set` e executá-los localmente (preciso que você rode e confirme), ou
- Preparar um script que ajude a inicializar os serviços (railway/render) via CLI.
