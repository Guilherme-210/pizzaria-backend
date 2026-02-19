# Pizzaria Backend

Backend service para aplicação de gerenciamento de pizzaria, desenvolvido com Node.js, Express, TypeScript, Prisma ORM e Neon Postgres.

## ✅ Visão Geral

- **Base URL:** `/api`
- **Arquitetura:** Layered Architecture (Routes → Middlewares → Controllers → Services → Prisma → PostgreSQL)
- **Autenticação:** JWT (`Authorization: Bearer <token>`)
- **Autorização:** RBAC por `role` (`ADMIN` | `STAFF`)

Para detalhes de arquitetura, modelagem e fluxos, veja [PROJETO_CONTEXTO.md](PROJETO_CONTEXTO.md).

---

## 🧰 Requisitos

- Node.js >= 18
- NPM
- Banco PostgreSQL (local ou Neon)

---

## 🚀 Instalação e Execução (Local)

### 1) Instalar dependências

```bash
npm install
```

### 2) Configurar variáveis de ambiente

- Crie um `.env` na raiz com base no `.env.example`.
- Preencha `DATABASE_URL`, `JWT_SECRET` e credenciais do Cloudinary (se for testar upload).

### 3) Prisma (gerar client + sincronizar schema)

```bash
npm run db:generate
npm run db:push
```

> Alternativa com histórico de mudanças: use `npm run db:migrate`.

### 4) Subir o servidor

```bash
npm run dev
```

O serviço expõe um healthcheck simples em `GET /api`.

---

## 📄 Contrato de Resposta da API

O projeto segue um envelope padrão para sucesso, além de formatos específicos para validação e erros.

### Sucesso

```json
{
	"status": "success",
	"data": {}
}
```

### Erro de validação (Zod)

```json
{
	"status": "Error de validação",
	"errors": [
		{ "campo": "campo", "mensagem": "mensagem" }
	]
}
```

### Erro geral

```json
{
	"message": "Descrição do erro",
	"statusCode": 400
}
```

---

## 🧱 Decisões Arquiteturais

- **Camadas bem definidas:** Rotas apenas compõem middlewares e controllers; regras ficam nos services.
- **Prisma Client gerado no repositório:** saída em `src/generated/prisma` para manter tipos e cliente versionados no build.
- **Validação de entrada:** Zod + middleware de validação por schema.
- **Autenticação/Autorização:** JWT + middlewares `isAuthenticated` e `isAdmin`.
- **Upload de imagens:** Multer em memória + Cloudinary.
	- **Criação/Edição de produto:** aceita **upload** (`file`) e/ou **URL direta** (`banner_url`).

---

## 📦 Scripts Disponíveis

### **🚀 Desenvolvimento e Produção**

#### `npm run dev`
Inicia o servidor em **modo desenvolvimento** com hot-reload.
- Utiliza `tsx watch` para recarregar automaticamente ao detectar mudanças
- Ideal para desenvolvimento local
```bash
npm run dev
```

#### `npm run build`
Compila o projeto TypeScript para JavaScript e prepara para produção.
- Gera o Prisma Client (`prisma generate`)
- Compila TypeScript → JavaScript (`tsc`)
- Resolve path aliases (`tsc-alias`)
- Saída compilada na pasta `dist/`
```bash
npm run build
```

#### `npm start`
Inicia o servidor em **modo produção** a partir do código compilado.
- Executa o código da pasta `dist/`
- Requer executar `npm run build` antes
- Resolve path aliases em runtime
```bash
npm start
```

---

### **🗄️ Banco de Dados**

#### `npm run prisma:studio`
Abre o Prisma Studio usando a URL do banco vinda do `.env`.
- Usa a variavel `DATABASE_URL` para evitar expor credenciais
- Indicado quando voce quer forcar uma URL especifica no comando
```bash
npm run prisma:studio
```

#### `npm run db:generate`
Gera o Prisma Client com base no schema atual.
- Execute após modificar `prisma/schema.prisma`
- Atualiza os types TypeScript do banco
```bash
npm run db:generate
```

#### `npm run db:push`
Sincroniza o schema Prisma com o banco de dados **sem criar migrations**.
- **Ideal para desenvolvimento rápido**
- Atualiza o banco diretamente
- ⚠️ Não recomendado para produção (use migrations)
```bash
npm run db:push
```

#### `npm run db:migrate`
Cria e aplica uma **migration** versionada no banco de dados.
- **Recomendado para desenvolvimento e produção**
- Mantém histórico de mudanças
- Permite rollback se necessário
- Pede um nome descritivo para a migration
```bash
npm run db:migrate
# Exemplo: "add_user_avatar_field"
```

#### `npm run db:migrate:prod`
Aplica migrations pendentes em **produção**.
- Executa `prisma migrate deploy`
- Não cria novas migrations, apenas aplica as existentes
- Ideal para pipelines CI/CD
```bash
npm run db:migrate:prod
```

#### `npm run db:studio`
Abre o **Prisma Studio** - interface visual para gerenciar dados.
- Visualiza, edita e deleta registros
- Interface gráfica no navegador
- Ideal para debug e testes
```bash
npm run db:studio
```

#### `npm run db:seed`
Popula o banco com **dados iniciais** (seed).
- Executa `prisma/seed.ts`
- Útil para criar dados de teste
- ⚠️ Arquivo `seed.ts` precisa ser criado
```bash
npm run db:seed
```

#### `npm run db:test`
Testa a **conexão com o banco de dados**.
- Verifica se a conexão está funcionando
- Exibe informações da conexão
- Mostra contagem de registros nas tabelas
```bash
npm run db:test
```

---

### **🔧 Automático**

#### `postinstall`
Executado **automaticamente** após `npm install`.
- Gera o Prisma Client automaticamente
- Garante que o cliente está sempre atualizado
- Útil em ambientes CI/CD e onboarding de novos devs

---

## 🗂️ Endpoints

## **🔓 Rotas Públicas**

- [ ]  POST /user - Criar usuário
- [ ]  POST /user/auth - Login (autenticação)
- [ ]  GET /category/product - Listar produtos por categoria (via query `category_id`)

## **🔒 Rotas Autenticadas**

### **👤 Usuários**

- [ ]  GET /user/detail - Obter dados do usuário logado

### **📁 Categorias**

- [ ]  POST /category - Criar categoria **(requer ADMIN)**
- [ ]  GET /category - Listar todas as categorias

### **🍕 Produtos**

- [ ]  POST /products - Criar produto (upload `file` ou `banner_url`) **(requer ADMIN)**
- [ ]  PATCH /products/:id - Editar produto (upload `file` ou `banner_url`) **(requer ADMIN)**
- [ ]  DELETE /products - Deletar produto **(requer ADMIN)**
- [ ]  GET /products - Listar produtos (filtro opcional `disabled=true|false`)
- [ ]  GET /products/search - Buscar produtos
- [ ]  GET /products/:id - Detalhar produto

### **📋 Pedidos**

- [ ]  POST /order - Criar pedido
- [ ]  POST /order/add - Adicionar item ao pedido
- [ ]  DELETE /order/remove - Remover item do pedido
- [ ]  GET /orders - Listar todos os pedidos (com filtro opcional por draft)
- [ ]  GET /order/detail - Obter detalhes de um pedido específico
- [ ]  PUT /order/send - Enviar pedido para produção
- [ ]  PUT /order/finish - Finalizar pedido
- [ ]  DELETE /order - Deletar pedido