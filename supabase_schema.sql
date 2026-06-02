-- Schema adaptado para PostgreSQL (Supabase)

CREATE TABLE tbestado (
  id serial PRIMARY KEY,
  uf char(2) NOT NULL,
  nomeEstado varchar(50) NOT NULL,
  cultDescricao1 text NOT NULL,
  cultDescricao2 text NOT NULL,
  nomePonto1 varchar(100) NOT NULL,
  nomePonto2 varchar(100) NOT NULL,
  nomePonto3 varchar(100) NOT NULL,
  nomePonto4 varchar(100) NOT NULL,
  descPonto1 text NOT NULL,
  descPonto2 text NOT NULL,
  descPonto3 text NOT NULL,
  descPonto4 text NOT NULL,
  saudeP1 text NOT NULL,
  saudeP2 text NOT NULL,
  escolaP1 text NOT NULL,
  nomeEsc1 varchar(200) NOT NULL,
  nomeEsc2 varchar(200) NOT NULL,
  nomeEsc3 varchar(200) NOT NULL,
  nomeEsc4 varchar(200) NOT NULL,
  nomeEsc5 varchar(200) NOT NULL,
  nomeEsc6 varchar(200) NOT NULL,
  locP1 text NOT NULL,
  locP2 text NOT NULL,
  locP3 text NOT NULL,
  img1 varchar(255) DEFAULT NULL,
  imgCult varchar(255) DEFAULT NULL,
  imgPonto1 varchar(255) DEFAULT NULL,
  imgPonto2 varchar(255) DEFAULT NULL,
  imgPonto3 varchar(255) DEFAULT NULL,
  imgPonto4 varchar(255) DEFAULT NULL
);

CREATE TABLE tbusuarios (
  idUsuario serial PRIMARY KEY,
  nomeUsuario varchar(50) NOT NULL,
  emailUsuario varchar(60) NOT NULL,
  telefoneUsuario varchar(11) NOT NULL,
  nacionalidadeUsuario varchar(50) NOT NULL,
  senhaUsuario varchar(30) NOT NULL,
  conf_senha varchar(30) NOT NULL,
  profile_picture_path varchar(255) DEFAULT NULL
);
