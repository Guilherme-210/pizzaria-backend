# 📋 Contexto do Projeto - Pizzaria Backend

Documento técnico do projeto contendo arquitetura, modelagem, contratos e exemplos reais de uso da API.

## 📌 Especificações do Projeto

| Propriedade | Descrição |
|-------------|-----------|
| **Nome** | pizzaria-backend |
| **Versão** | 1.0.0 |
| **Descrição** | Backend service for Pizzaria application |
| **Tipo** | CommonJS |
| **Ponto de Entrada** | src/server.ts |
| **Objetivo** | API REST para gerenciar pedidos, categorias, produtos e usuários de uma pizzaria |

---

## 🧱 Decisões Arquiteturais

1. **Arquitetura em camadas (Layered Architecture)**
  - Rotas apenas compõem middlewares e controllers.
  - Controllers fazem I/O HTTP (req/res) e delegam regras aos services.
  - Services concentram regra de negócio e persistência via Prisma.

2. **Prisma como camada de acesso a dados**
  - Prisma Client gerado (output) em `src/generated/prisma`.
  - Regras de consulta e `select` ficam nos services para controlar payload.

3. **Validação com Zod via middleware**
  - Schemas centralizados em `src/schemas/*`.
  - Middleware valida `body`, `params` e `query`.

4. **Autenticação JWT + autorização por role**
  - `isAuthenticated` injeta `req.user_id`.
  - `isAdmin` restringe operações administrativas.

5. **Mídia (imagem) de produto**
  - Upload: Multer em memória + Cloudinary.
  - Alternativa: envio de URL direta no campo `banner_url`.

## 🏗️ Arquitetura

A aplicação segue a arquitetura em **camadas** (Layered Architecture), estruturada da seguinte forma:

```
CLIENT
  ↓
ROUTES (Rotas)
  ↓
MIDDLEWARES (Validação & Autenticação)
  ↓
CONTROLLERS (Lógica de Requisição)
  ↓
SERVICES (Lógica de Negócio)
  ↓
PRISMA CLIENT (Banco de Dados)
  ↓
DATABASE (PostgreSQL)
```

### Fluxo de Requisição

1. **ROUTES** - Define as rotas HTTP e aplica middlewares
2. **MIDDLEWARES** - Valida dados (Zod) e verifica autenticação/autorização
3. **CONTROLLERS** - Recebe a requisição validada, chama o service e retorna a resposta
4. **SERVICES** - Executa a lógica de negócio, comunica com o banco de dados e retorna resultado
5. **CONTROLLERS** - Formata a resposta e envia ao cliente

---

## 📄 Contrato de Resposta da API

Este projeto utiliza um envelope de sucesso e formatos específicos para erros. Os exemplos abaixo representam o contrato esperado pelas rotas.

### Sucesso

```json
{
  "status": "success",
  "data": {
    "any": "payload"
  }
}
```

### Erro de validação (Zod)

```json
{
  "status": "Error de validação",
  "errors": [
    {
      "campo": "campo",
      "mensagem": "mensagem"
    }
  ]
}
```

Exemplo (campo inválido):

```json
{
  "status": "Error de validação",
  "errors": [
    {
      "campo": "name",
      "mensagem": "Nome deve conter pelo menos 3 caracteres"
    }
  ]
}
```

### Erro geral (regra de negócio / service)

```json
{
  "message": "Descrição do erro",
  "statusCode": 400
}
```

### Erro tratado pelo middleware global

```json
{
  "error": "Mensagem de erro"
}
```

## 🌐 Endpoints

### Base URL: `/api`

### 👤 Usuários

| Método | Endpoint | Descrição | Autenticação | Autorização |
|--------|----------|-----------|--------------|-------------|
| **POST** | `/user/` | Criar novo usuário | Não | Não |
| **POST** | `/user/auth` | Autenticar usuário (Login) | Não | Não |
| **GET** | `/user/detail` | Obter detalhes do usuário logado | Sim (JWT) | - |

### 📂 Categorias

| Método | Endpoint | Descrição | Autenticação | Autorização |
|--------|----------|-----------|--------------|-------------|
| **POST** | `/category/` | Criar categoria | Sim (JWT) | Admin |
| **DELETE** | `/category/` | Deletar categoria | Sim (JWT) | Admin |
| **GET** | `/category/` | Listar todas as categorias | Sim (JWT) | - |
| **PUT** | `/category/:id` | Editar categoria | Sim (JWT) | Admin |

### 🍕 Produtos

| Método | Endpoint | Descrição | Autenticação | Autorização |
|--------|----------|-----------|--------------|-------------|
| **POST** | `/products/` | Criar produto (upload `file` ou `banner_url`) | Sim (JWT) | Admin |
| **PATCH** | `/products/:id` | Editar produto (upload `file` ou `banner_url`) | Sim (JWT) | Admin |
| **GET** | `/products/` | Listar produtos (filtro opcional `disabled=true|false`) | Não | - |
| **GET** | `/products/search` | Buscar produtos | Não | - |
| **GET** | `/products/:id` | Detalhar produto | Não | - |
| **GET** | `/category/product` | Listar produtos por categoria (query `category_id`) | Não | - |

---

## 📁 Organização de Pastas

```
pizzaria-backEnd/
├── src/
│   ├── @types/                  # Extensões e tipos customizados
│   │   └── express/
│   │       └── index.d.ts       # Extensões do Express (req.user_id)
│   │
│   ├── configs/                 # Configurações da aplicação
│   │   ├── database.ts          # Configuração do banco de dados
│   │   ├── multer.ts            # Configuração de upload de arquivos
│   │   └── index.ts
│   │
│   ├── controllers/             # Camada de Controle
│   │   ├── category/
│   │   │   ├── createCategory.controller.ts
│   │   │   ├── deleteCategory.controller.ts
│   │   │   ├── listCategories.controller.ts
│   │   │   └── editCategory.controller.ts
│   │   ├── products/
│   │   │   └── createProduct.controller.ts
│   │   ├── users/
│   │   │   ├── authUser.controller.ts
│   │   │   ├── createUser.controller.ts
│   │   │   └── detailUser.controller.ts
│   │   └── index.ts
│   │
│   ├── generated/               # Código gerado pelo Prisma
│   │   └── prisma/
│   │       ├── browser.ts
│   │       ├── client.ts
│   │       ├── commonInputTypes.ts
│   │       ├── enums.ts
│   │       ├── models.ts
│   │       ├── internal/
│   │       └── models/
│   │
│   ├── models/                  # Modelos de dados (tipos)
│   │
│   ├── prisma/                  # Cliente Prisma
│   │   └── index.ts
│   │
│   ├── routes/                  # Definição de rotas
│   │   ├── category/
│   │   │   ├── createCategory.route.ts
│   │   │   ├── deleteCategory.route.ts
│   │   │   ├── listCategories.route.ts
│   │   │   └── editCategory.route.ts
│   │   ├── products/
│   │   │   └── createProduct.route.ts
│   │   ├── users/
│   │   │   ├── authUser.route.ts
│   │   │   ├── createUser.route.ts
│   │   │   └── detailUser.route.ts
│   │   └── routes.ts            # Rotas principais
│   │
│   ├── schemas/                 # Validação com Zod
│   │   ├── category.schemas.ts
│   │   ├── user.schemas.ts
│   │   └── index.ts
│   │
│   ├── services/                # Camada de Negócio
│   │   ├── category/
│   │   │   ├── createCategory.service.ts
│   │   │   ├── deleteCategory.service.ts
│   │   │   ├── listCategories.service.ts
│   │   │   └── editCategory.service.ts
│   │   ├── products/
│   │   │   └── createProduct.service.ts
│   │   ├── user/
│   │   │   ├── authUser.service.ts
│   │   │   ├── createUser.service.ts
│   │   │   └── detailUser.service.ts
│   │   └── index.ts
│   │
│   ├── shareds/                 # Compartilhados
│   │   ├── constants/           # Constantes da aplicação
│   │   ├── errors/              # Classes de erro customizadas
│   │   ├── middlewares/         # Middlewares Express
│   │   │   ├── index.ts
│   │   │   ├── isAdmin.ts       # Verifica se é admin
│   │   │   ├── isAuthenticated.ts # Verifica autenticação JWT
│   │   │   └── validateSchemas.ts # Valida com Zod
│   │   └── utils/               # Funções utilitárias
│   │
│   ├── types/                   # Tipos TypeScript globais
│   │
│   ├── app.ts                   # Configuração da aplicação Express
│   └── server.ts                # Inicialização do servidor
│
├── prisma/
│   └── schema.prisma            # Definição do schema do banco de dados
│
├── nodemon.json                 # Configuração do Nodemon
├── package.json                 # Dependências e scripts
├── prisma.config.ts             # Configuração Prisma (se usado)
├── tsconfig.json                # Configuração TypeScript
├── README.md                     # Documentação do projeto
└── test-connection.ts           # Script para testar conexão com BD
```

---

## 📦 Versões de Bibliotecas

### Runtime & Build

| Biblioteca     | Versão | Descrição |
|----------------|--------|-----------|
| **Node.js**    | ------ | Recomendado: >=18.0.0 (CJS) |
| **TypeScript** | 5.9.3  | Linguagem principal |
| **tsx**        | 4.21.0 | Executor TypeScript |

### Core Framework

| Biblioteca         | Versão | Descrição |
|--------------------|--------|-----------|
| **Express**        | 5.2.1  | Framework web |
| **CORS**           | 2.8.6  | Middleware CORS |

### Database

| Biblioteca                 | Versão | Descrição |
|----------------------------|--------|-----------|
| **Prisma Client**          | 7.4.0  | ORM TypeScript |
| **Prisma Adapter PG**      | 7.4.0  | Adapter PostgreSQL para Prisma |
| **PostgreSQL Driver (pg)** | 8.18.0 | Driver nativo PostgreSQL |

### Segurança & Autenticação

| Biblioteca         | Versão | Descrição |
|--------------------|--------|-----------|
| **bcryptjs**       | 3.0.3  | Hash de senhas |
| **JSON Web Token** | 9.0.3  | Autenticação JWT |

### Validação

| Biblioteca        | Versão | Descrição |
|-------------------|--------|-----------|
| **Zod**           | 4.3.6  | Schema validation |

### Upload de Arquivos

| Biblioteca | Versão | Descrição |
|-----------|--------|-----------|
| **Multer** | 2.0.2 | Middleware para upload de imagens |
| **@types/multer** | 2.0.0 | Tipos TypeScript para Multer |
| **Cloudinary** | 2.9.0 | Serviço de armazenamento de imagens em nuvem |

### Utilitários

| Biblioteca         | Versão | Descrição |
|--------------------|--------|-----------|
| **dotenv**         | 17.3.1 | Variáveis de ambiente |
| **tsconfig-paths** | 4.2.0  | Alias de paths em TypeScript |
| **tsc-alias**      | 1.8.16 | Resolve aliases na compilação |
| **Nodemon**        | 3.1.11 | Dev server com hot reload |

---

## 🗄️ Modelagem do Banco de Dados

### PostgreSQL + Prisma

#### Modelo: User (Usuários)

```prisma
model User {
  id       String  @id @default(uuid())
  name     String
  email    String  @unique
  password String
  role     Role    @default(STAFF)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

| Campo | Tipo | Descrição | Constraint |
|-------|------|-----------|-----------|
| **id** | UUID | ID único | PK, Default UUID |
| **name** | String | Nome do usuário | Obrigatório |
| **email** | String | Email do usuário | Obrigatório, Único |
| **password** | String | Senha (hash bcrypt) | Obrigatório |
| **role** | Role (enum) | Papel do usuário | Default: STAFF |
| **createdAt** | DateTime | Data de criação | Auto |
| **updatedAt** | DateTime | Data de atualização | Auto |

**Enum Role:**
- `STAFF` - Funcionário padrão
- `ADMIN` - Administrador

---

#### Modelo: Category (Categorias)

```prisma
model Category {
  id        String    @id @default(uuid())
  name      String    @unique
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

| Campo | Tipo | Descrição | Constraint |
|-------|------|-----------|-----------|
| **id** | UUID | ID único | PK, Default UUID |
| **name** | String | Nome da categoria | Obrigatório, Único |
| **products** | Product[] | Produtos da categoria | Relação 1:N |
| **createdAt** | DateTime | Data de criação | Auto |
| **updatedAt** | DateTime | Data de atualização | Auto |

---

#### Modelo: Product (Produtos)

```prisma
model Product {
  id          String    @id @default(uuid())
  name        String
  price       Int
  description String
  banner      String
  disabled    Boolean   @default(false)
  orderItems  OrderItem[]
  category_id String
  category    Category  @relation(fields: [category_id], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

| Campo | Tipo | Descrição | Constraint |
|-------|------|-----------|-----------|
| **id** | UUID | ID único | PK, Default UUID |
| **name** | String | Nome do produto | Obrigatório |
| **price** | Int | Preço em centavos | Obrigatório |
| **description** | String | Descrição do produto | Obrigatório |
| **banner** | String | URL da imagem/banner | Obrigatório |
| **disabled** | Boolean | Status do produto | Default: false |
| **category_id** | String | ID da categoria | FK, Obrigatório |
| **category** | Category | Relação com categoria | 1:1, Cascade Delete |
| **orderItems** | OrderItem[] | Itens de pedido | Relação 1:N |
| **createdAt** | DateTime | Data de criação | Auto |
| **updatedAt** | DateTime | Data de atualização | Auto |

---

#### Modelo: Order (Pedidos)

```prisma
model Order {
  id         String      @id @default(uuid())
  table      Int
  status     Boolean     @default(false)  // falso = pendente
  drawer     Boolean     @default(true)   // true = enviado para cozinha
  name       String?
  orderItems OrderItem[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}
```

| Campo | Tipo | Descrição | Constraint |
|-------|------|-----------|-----------|
| **id** | UUID | ID único | PK, Default UUID |
| **table** | Int | Número da mesa | Obrigatório |
| **status** | Boolean | Status do pedido | Default: false (pendente) |
| **drawer** | Boolean | Enviado à cozinha | Default: true |
| **name** | String | Nome do cliente | Opcional |
| **orderItems** | OrderItem[] | Itens do pedido | Relação 1:N |
| **createdAt** | DateTime | Data de criação | Auto |
| **updatedAt** | DateTime | Data de atualização | Auto |

---

#### Modelo: OrderItem (Itens de Pedido)

```prisma
model OrderItem {
  id         String    @id @default(uuid())
  amount     Int
  order_id   String
  order      Order     @relation(fields: [order_id], references: [id], onDelete: Cascade)
  product_id String
  product    Product   @relation(fields: [product_id], references: [id], onDelete: Cascade)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}
```

| Campo | Tipo | Descrição | Constraint |
|-------|------|-----------|-----------|
| **id** | UUID | ID único | PK, Default UUID |
| **amount** | Int | Quantidade | Obrigatório |
| **order_id** | String | ID do pedido | FK, Obrigatório, Cascade Delete |
| **order** | Order | Relação com pedido | 1:1 |
| **product_id** | String | ID do produto | FK, Obrigatório, Cascade Delete |
| **product** | Product | Relação com produto | 1:1 |
| **createdAt** | DateTime | Data de criação | Auto |
| **updatedAt** | DateTime | Data de atualização | Auto |

---

### Diagrama de Relacionamentos

```
┌─────────────────┐
│     User        │
│─────────────────│
│ id (PK)         │
│ name            │
│ email (UNIQUE)  │
│ password        │
│ role            │
│ createdAt       │
│ updatedAt       │
└─────────────────┘

┌─────────────────┐             ┌─────────────────┐
│   Category      │──────────>  │    Product      │
│─────────────────│   1:N       │─────────────────│
│ id (PK)         │             │ id (PK)         │
│ name (UNIQUE)   │             │ name            │
│ createdAt       │             │ price           │
│ updatedAt       │             │ description     │
│                 │             │ banner          │
│                 │             │ disabled        │
│                 │             │ category_id (FK)│
│                 │             │ createdAt       │
│                 │             │ updatedAt       │
│                 │             └─────────────────┘
└─────────────────┘                      |
                                         | 1:N
                                         |
                        ┌────────────────────────┐
                        │    OrderItem           │
                        │────────────────────────│
                        │ id (PK)                │
                        │ amount                 │
                        │ order_id (FK)          │
                        │ product_id (FK)        │
                        │ createdAt              │
                        │ updatedAt              │
                        └────────────────────────┘
                                  |
                                  | 1:N
                                  |
                        ┌──────────────────────┐
                        │      Order           │
                        │──────────────────────│
                        │ id (PK)              │
                        │ table                │
                        │ status              │
                        │ drawer               │
                        │ name                 │
                        │ createdAt            │
                        │ updatedAt            │
                        └──────────────────────┘
```

---

## ✅ Validação com Zod

A validação é feita através do middleware `validateSchema` que utiliza **Zod**.

### User Schemas

#### Create User Schema

```typescript
z.object({
  body: z.object({
    name: z.string()
      .message('Nome é obrigatório')
      .min(3, { message: 'Nome deve conter pelo menos 3 caracteres' }),
    email: z.email({ message: 'Precisa ser um email válido' }),
    password: z.string()
      .message('Senha é obrigatória')
      .min(6, { message: 'Senha deve conter pelo menos 6 caracteres' })
  })
})
```

#### Auth User Schema

```typescript
z.object({
  body: z.object({
    email: z.email({ message: 'Precisa ser um email válido' }),
    password: z.string({ message: 'Senha é obrigatória' })
  })
})
```

### Category Schemas

#### Create Category Schema

```typescript
z.object({
  body: z.object({
    name: z.string()
      .message('Nome é obrigatório')
      .min(3, { message: 'Nome deve conter pelo menos 3 caracteres' })
  })
})
```

#### Delete Category Schema

```typescript
z.object({
  body: z.object({
    id: z.string()
      .message('ID é obrigatório')
      .min(1, { message: 'ID deve conter pelo menos 1 caractere' })
  })
})
```

### Product Schemas

#### Create Product Schema

```typescript
z.object({
  body: z.object({
    name: z.string()
      .min(3, { message: 'Nome deve conter pelo menos 3 caracteres' }),
    price: z.string()
      .min(1, { message: 'Preço deve conter pelo menos 1 caractere' })
      .regex(/^\d+(\.\d{1,2})?$/, { message: 'Preço deve ser um número válido, podendo conter até 2 casas decimais' }),
    description: z.string()
      .min(10, { message: 'Descrição deve conter pelo menos 10 caracteres' }),
    category_id: z.string({ message: 'ID da categoria deve conter pelo menos 1 caractere' })
  })
})
```

**Observação:** O upload de arquivo é feito via multer (middleware), não via Zod.

**Observação (implementação atual):** também é possível informar `banner_url` (URL da imagem) no body para criar/editar produtos sem upload.

**Nota:** O exemplo de resposta para erro de validação está padronizado em **Contrato de Resposta da API**.

---

## 🔐 Middlewares

### 1. isAuthenticated

**Arquivo:** `src/shareds/middlewares/isAuthenticated.ts`

**Função:** Valida JWT e verifica autenticação do usuário

**Como funciona:**
- Extrai o token JWT do header `Authorization: Bearer <token>`
- Verifica e decodifica o token usando `process.env.JWT_SECRET`
- Se válido, adiciona `user_id` ao objeto `req` para uso posterior
- Se inválido, retorna erro 401

**Uso:**
```typescript
router.post('/categoria', isAuthenticated, controller)
```

**Resposta em caso de erro:**
```json
{
  "error": "Token não fornecido"
  // ou
  "error": "Token inválido"
}
```

---

### 2. isAdmin

**Arquivo:** `src/shareds/middlewares/isAdmin.ts`

**Função:** Verifica se o usuário autenticado é administrador

**Como funciona:**
- Valida se `req.user_id` existe (requer `isAuthenticated` antes)
- Consulta o banco de dados para verificar o papel do usuário
- Retorna erro 403 se o usuário não é admin

**Uso:**
```typescript
router.post('/categoria', isAuthenticated, isAdmin, controller)
```

**Fluxo:**
1. Verifica autenticação (isAuthenticated)
2. Extrai user_id do req
3. Query no banco: `SELECT * FROM users WHERE id = ?`
4. Valida se `user.role === 'ADMIN'`
5. Retorna erro 403 se não autorizado

**Resposta em caso de erro:**
```json
{
  "error": "Usuário não autenticado"
  // ou
  "error": "Usuário sem permissão de administrador"
}
```

---

### 3. validateSchema

**Arquivo:** `src/shareds/middlewares/validateSchema.ts`

**Função:** Valida requisição contra um schema Zod

**Como funciona:**
- Recebe um schema Zod como parâmetro
- Valida `body`, `query` e `params` da requisição
- Se válido, passa à próxima função
- Se inválido, retorna erro 400 com detalhes

**Uso:**
```typescript
router.post('/user', validateSchema(userSchemas.create), controller)
```

**Resposta em caso de erro:**
```json
{
  "status": "Error de validação",
  "errors": [
    {
      "campo": "email",
      "mensagem": "Precisa ser um email válido"
    },
    {
      "campo": "password",
      "mensagem": "Senha deve conter pelo menos 6 caracteres"
    }
  ]
}
```

---

### 4. Error Handler (Global)

**Arquivo:** `src/app.ts`

**Função:** Middleware global de tratamento de erros

```typescript
app.use((error: Error, _: Request, res: Response, _next: NextFunction) => {
  if (error instanceof Error) {
    return res.status(400).json({
      error: error.message
    });
  }

  return res.status(500).json({
    error: 'Internal server error'
  });
});
```

---

## 📤 Upload de Arquivos com Multer

### Configuração

**Arquivo:** `src/configs/multer.ts`

A aplicação utiliza **Multer** para gerenciar uploads de imagens com a seguinte configuração:

```typescript
{
    storage: multer.memoryStorage(),           // Armazena em memória (antes de enviar para Cloudinary)
    limits: {
        fileSize: 5 * 1024 * 1024,             // Limite: 5MB por arquivo
    },
    fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não permitido. Apenas JPEG, JPG, PNG e GIF são aceitos.'));
        }
    }
}
```

### Como Funciona

1. **Memory Storage**: Arquivos são armazenados em memória para upload rápido
2. **Limit 5MB**: Apenas arquivos menores que 5MB são aceitos
3. **Filtro MIME**: Apenas imagens (JPEG, JPG, PNG, GIF) são permitidas
4. **Cloudinary**: Imagens são enviadas para Cloudinary após validação

### Integração com Rotas

**Arquivo:** `src/routes/products/createProduct.route.ts`

```typescript
const upload = multer(uploadConfig);

createProductRoutes.post(
    '/', 
    isAuthenticated,           // 1. Verifica autenticação
    isAdmin,                   // 2. Verifica permissão de admin
    upload.single('file'),     // 3. Processa upload (campo 'file')
    validateSchema(productSchemas.create), // 4. Valida body
    createProduct              // 5. Cria produto
);
```

### Fluxo de Upload

```
Client envia POST /products/ com uma das opções:

Opção A (upload):
- form-data: file (imagem)
- form-data: name, description, price, category_id

Opção B (URL direta):
- JSON: banner_url (URL da imagem)
- JSON: name, description, price, category_id
  ↓
Middleware: isAuthenticated verificaToken
  ↓
Middleware: isAdmin verifica permissão
  ↓
Middleware: multer.single('file')
  - Adiciona req.file (buffer, originalname, mimetype, etc)
  - Valida tipo e tamanho
  ↓
Middleware: validateSchema valida body
  ↓
Controller: createProductController
  - Extrai req.file.buffer (dados da imagem)
  - Extrai req.body (name, description, price, category_id)
  ↓
Service: createProductService
  - Envia imagem para Cloudinary
  - Recebe URL da imagem
  - Salva produto no banco com URL
  ↓
Response: { status: 'success', data: { ...produto } }
```

---

## 🚀 Scripts de Desenvolvimento

```bash
# Iniciar servidor com hot reload
npm run dev

# Compilar TypeScript
npm run build

# Iniciar servidor compilado
npm start

# Abrir Prisma Studio (UI para visualizar dados)
npm run prisma:studio

# Gerar cliente Prisma
npm run db:generate

# Enviar schema ao banco (sem migrações)
npm run db:push

# Criar nova migração
npm run db:migrate

# Aplicar migrações em produção
npm run db:migrate:prod

# Seed do banco (se existir)
npm run db:seed

# Testar conexão com o banco
npm run db:test
```

---

## 🔧 Configuração de Ambiente

Crie um arquivo `.env` na raiz com:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pizzaria"

# JWT
JWT_SECRET="sua-chave-secreta-super-segura"

# Server
PORT=3000
NODE_ENV="development"
```

---

## 📝 Extensões de Tipos

### Express Request

**Arquivo:** `src/@types/express/index.d.ts`

Estende o tipo `Request` do Express para incluir `user_id`:

```typescript
declare global {
  namespace Express {
    interface Request {
      user_id?: string; // Adicionado pelo middleware isAuthenticated
    }
  }
}
```

---

## 📌 Exemplos de Uso da API

### 1. Criar Usuário (Signup)

```bash
curl -X POST http://localhost:3000/api/user/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123456"
  }'
```

**Resposta (201):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid-123",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "STAFF",
    "createdAt": "2026-02-18T10:30:00Z"
  }
}
```

### 2. Autenticar Usuário (Login)

```bash
curl -X POST http://localhost:3000/api/user/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123456"
  }'
```

**Resposta (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid-123",
      "name": "João Silva",
      "email": "joao@example.com",
      "role": "STAFF"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 3. Listar Categorias

```bash
curl -X GET http://localhost:3000/api/category/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Resposta (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid-cat-1",
      "name": "Pizzas Salgadas",
      "createdAt": "2026-02-18T10:00:00Z",
      "updatedAt": "2026-02-18T10:00:00Z"
    },
    {
      "id": "uuid-cat-2",
      "name": "Bebidas",
      "createdAt": "2026-02-18T10:00:00Z",
      "updatedAt": "2026-02-18T10:00:00Z"
    }
  ]
}
```

### 4. Criar Categoria (Admin)

```bash
curl -X POST http://localhost:3000/api/category/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "name": "Pizzas Doces"
  }'
```

**Resposta (201):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid-cat-3",
    "name": "Pizzas Doces",
    "createdAt": "2026-02-18T10:30:00Z",
    "updatedAt": "2026-02-18T10:30:00Z"
  }
}
```

### 5. Editar Categoria (Admin)

```bash
curl -X PUT http://localhost:3000/api/category/uuid-cat-3 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{
    "name": "Pizzas Doces e Sobremesas"
  }'
```

**Resposta (200):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid-cat-3",
    "name": "Pizzas Doces e Sobremesas",
    "updatedAt": "2026-02-18T10:35:00Z"
  }
}
```

### 6. Criar Produto com Upload de Imagem (Admin)

```bash
curl -X POST http://localhost:3000/api/products/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -F "file=@/path/to/pizza.jpg" \
  -F "name=Pizza Margherita" \
  -F "price=29.99" \
  -F "description=Pizza clássica com molho de tomate, mozzarella e manjericão" \
  -F "category_id=uuid-cat-1"
```

**Resposta (201):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid-prod-1",
    "name": "Pizza Margherita",
    "price": 2999,
    "description": "Pizza clássica com molho de tomate, mozzarella e manjericão",
    "banner": "https://cloudinary.com/...",
    "disabled": false,
    "category_id": "uuid-cat-1",
    "createdAt": "2026-02-18T10:40:00Z",
    "updatedAt": "2026-02-18T10:40:00Z"
  }
}
```

**Observação:** O campo `price` é enviado como string mas armazenado como inteiro (centavos). O campo `banner` contém a URL da imagem armazenada no Cloudinary.

### 7. Criar Produto com URL Direta (Admin)

```bash
curl -X POST http://localhost:3000/api/products/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pizza Margherita",
    "price": "29.99",
    "description": "Pizza clássica com molho de tomate, mozzarella e manjericão",
    "category_id": "uuid-cat-1",
    "banner_url": "https://example.com/pizza.jpg"
  }'
```

---

## 🔒 Fluxo de Autenticação

### 1. Criar Usuário (Signup)
```
POST /api/user/
Body: { name, email, password }
  ↓
Middleware: validateSchema
  ↓
Controller: createUserController
  ↓
Service: createUserService
  - Verifica se email já existe
  - Hash a senha com bcryptjs
  - Cria usuário no banco
  ↓
Response: { id, name, email, role, createdAt } (HTTP 201)
```

### 2. Autenticar Usuário (Login)
```
POST /api/user/auth
Body: { email, password }
  ↓
Middleware: validateSchema
  ↓
Controller: authUserController
  ↓
Service: authUserService
  - Busca usuário por email
  - Compara senha com hash
  - Gera JWT token
  ↓
Response: { user: {...}, token: "jwt..." } (HTTP 200)
```

### 3. Acessar Recurso Protegido
```
POST /api/category/
Headers: { Authorization: "Bearer <jwt-token>" }
Body: { name }
  ↓
Middleware: isAuthenticated
  - Extrai token
  - Verifica assinatura
  ✓ Adiciona user_id ao req
  ↓
Middleware: isAdmin
  - Verifica se user_id é admin
  ✓ Autoriza se admin
  ↓
Middleware: validateSchema
  - Valida body
  ↓
Controller: createCategoryController
  ↓
Service: createCategoryService
  ↓
Response: { id, name, createdAt } (HTTP 201)
```

---

## 📄 Estrutura de Response

> Referência final do contrato (consistente com **Contrato de Resposta da API**).

### Sucesso
```json
{
  "status": "success",
  "data": {
    // dados retornados
  }
}
```

### Erro de Validação
```json
{
  "status": "Error de validação",
  "errors": [
    {
      "campo": "campo",
      "mensagem": "mensagem de erro"
    }
  ]
}
```

### Erro Geral
```json
{
  "message": "Descrição do erro",
  "statusCode": 400
}
```

---

## 🎯 Funcionalidades Implementadas ✅

- [x] Autenticação de usuários com JWT
- [x] Autorização baseada em roles (Admin/Staff)
- [x] CRUD básico de Categorias (Create, List, Edit, Delete)
- [x] Validação com Zod
- [x] Upload de imagens com Multer + Cloudinary
- [x] Criação de Produtos com imagem
- [x] Hashing de senhas com bcryptjs

## 🎯 Próximas Funcionalidades a Implementar

- [ ] Endpoints para CRUD completo de Produtos (Read, Update, Delete)
- [ ] Endpoints para gerenciamento de Pedidos (Create, List, Update, Delete)
- [ ] Endpoints para itens de pedido
- [ ] Paginação em listagens
- [ ] Filtros e busca avançada
- [ ] Testes unitários e de integração
- [ ] Documentação Swagger/OpenAPI
- [ ] Rate limiting
- [ ] Logs estruturados
- [ ] Sistema de permissões granulares
- [ ] Relatórios de vendas

---

## 📞 Contato & Suporte

Para dúvidas sobre a arquitetura ou implementação, consulte a documentação do:
- [Express.js](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Zod Validation](https://zod.dev/)
- [JWT](https://jwt.io/)
- [Multer](https://github.com/expressjs/multer)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
