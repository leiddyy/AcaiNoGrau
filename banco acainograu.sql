
CREATE TABLE CLIENTE(
 id_cliente serial PRIMARY KEY,
 nome varchar(50) not null,
 telefone varchar(20) NOT NULL,
 email varchar(100) unique,
 senha varchar(255),
 data_cadastro timestamp default current_timestamp
 
);

CREATE TABLE endereco (
id_endereco serial primary key,
cliente_id int not null references cliente(id_cliente),
rua varchar(150),
numero varchar(20),
bairro varchar(100),
cidade varchar(100),
complemento varchar(100),
cep varchar(20)

);

CREATE TABLE categoria(
id_categoria serial primary key,
nome varchar(100) not null
);

CREATE TABLE produto(
id_produto serial primary key,
categoria_id int references categoria(id_categoria),
nome varchar(100) not null,
descricao text,
preco numeric(10, 2) not null,
imagem text, 
ativo boolean default true,
data_cadastro timestamp default currente_timestamp

);

CREATE TABLE adicionais (
id_adicional serial primary key,
nome varchar(100) not null,
preco numeric(10,2) not null

);


CREATE TABLE produto_adicional (
produto_id int references produto(id_produto),
adicional_id int references adicionais(id_adicional),
primary key(produto_id, adicional_id)

);

CREATE TABLE formas_pagamento (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50)
);

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES cliente(id_cliente),
    endereco_id INT REFERENCES endereco(id_endereco),
    forma_pagamento_id INT REFERENCES formas_pagamento(id),

    status VARCHAR(50) DEFAULT 'Pendente',

    tipo_entrega VARCHAR(20),

    taxa_entrega NUMERIC(10,2) DEFAULT 0,
    subtotal NUMERIC(10,2),
    valor_total NUMERIC(10,2),

    troco_para NUMERIC(10,2),

    observacao TEXT,

    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE pedido_itens (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id),
    produto_id INT REFERENCES produto(id_produto),

    quantidade INT NOT NULL,

    preco_unitario NUMERIC(10,2),
    subtotal NUMERIC(10,2),

    observacao TEXT
);


CREATE TABLE pedido_item_adicional (
    id SERIAL PRIMARY KEY,
    pedido_item_id INT REFERENCES pedido_itens(id),
    adicional_id INT REFERENCES adicionais(id_adicional),
    preco NUMERIC(10,2)
);


CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255),
    tipo VARCHAR(30),
    ativo BOOLEAN DEFAULT TRUE
);



INSERT INTO categoria(nome) VALUES
('Açaí'),
('Pastel'),
('Tapioca'),
('Churros'),
('Milk Shake'),
('Sorvetes'),
('Bebidas'),
('Batata Frita');


INSERT INTO formas_pagamento(nome) VALUES
('Pix'),
('Cartão Crédito'),
('Cartão Débito'),
('Dinheiro');


INSERT INTO adicionais(nome, preco) VALUES
('Granola', 2.00),
('Banana', 3.00),
('Leite Condensado', 2.50),
('Morango', 4.00),
('Cheddar', 3.50),
('Catupiry', 3.50),
('Chocolate', 2.50);

INSERT INTO produto(
    categoria_id,
    nome,
    descricao,
    preco
)
VALUES
(1, 'Açaí 300ml', 'Açaí tradicional', 12.00),
(1, 'Açaí 500ml', 'Açaí tradicional', 18.00),
(2, 'Pastel de Carne', 'Pastel recheado', 10.00),
(4, 'Churros Chocolate', 'Churros recheado', 8.00);


