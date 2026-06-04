# FiberOps

Sistema de gerenciamento de chamados para suporte técnico de provedores de internet.

## Desenvolvedor Responsável

* Ylgner Leite Cavalcanti

## Objetivo do Projeto

Sistema desenvolvido para gerenciamento de chamados técnicos, permitindo abrir solicitações, acompanhar o andamento dos atendimentos e registrar respostas aos clientes.

## Funcionalidades

* Login de usuários
* Cadastro de usuários
* Recuperação de senha
* Envio de ticket como convidado
* Abertura de chamados
* Dashboard administrativo
* Atualização de status dos chamados
* Controle de prioridades
* Resposta de chamados
* Histórico de respostas
* Exclusão de chamados

## Capturas de Tela

### Tela de Login

<img width="796" height="368" alt="image" src="https://github.com/user-attachments/assets/144adc33-0102-4363-b60a-53f5827e23c6" />

### Dashboard

<img width="785" height="371" alt="image (1)" src="https://github.com/user-attachments/assets/cfb77f4e-28f5-4c58-9719-ab0d5cf46f89" />

### Abrir Chamado

<img width="796" height="371" alt="image (2)" src="https://github.com/user-attachments/assets/5e9a3be7-c28f-4b8f-a596-420b8a977093" />

### Responder Chamado

<img width="783" height="354" alt="image (3)" src="https://github.com/user-attachments/assets/a8afc148-7f8f-4001-907c-18321af65079" />

### Histórico de Respostas

<img width="799" height="364" alt="image (4)" src="https://github.com/user-attachments/assets/ea495e19-7379-4b1d-ba8d-1776649d6a09" />

## Tecnologias Utilizadas

* React
* Node.js
* Express
* SQLite
* Git
* GitHub
* Docker
* GitHub Actions
* Vite

## Estrutura do Projeto

```bash
backend/
src/
public/
package.json
package-lock.json
vite.config.js
Dockerfile
README.md
```

## Como Executar o Projeto

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
node server.js
```

## Docker

O projeto utiliza Docker para facilitar a execução da aplicação em diferentes ambientes.

```bash
docker build -t fiberops .
```

## Segurança

O projeto utiliza variáveis de ambiente através do arquivo `.env`, evitando deixar informações sensíveis diretamente no código.

## Controle de Versão

O desenvolvimento do projeto foi realizado utilizando Git e GitHub para controle de versão e acompanhamento das alterações realizadas.

## Integração Contínua (CI/CD)

O projeto utiliza GitHub Actions para executar automaticamente o processo de build a cada novo push realizado no repositório.

## Observação

Projeto desenvolvido como atividade prática da disciplina de DevOps.
