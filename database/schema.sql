--
-- PostgreSQL database dump
--

\restrict EEfFCJOkFRjDZeRBQ4NDyRRPDk5vnBR3MyP1hZd2MM6DzgTtegBiAWqRyH6nPIZ

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.1

-- Started on 2026-03-13 14:53:47

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16402)
-- Name: comentarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comentarios (
    id integer NOT NULL,
    dispositivo_id integer,
    nombre_usuario character varying(100) NOT NULL,
    comentario text NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.comentarios OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16401)
-- Name: comentarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comentarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comentarios_id_seq OWNER TO postgres;

--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 221
-- Name: comentarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comentarios_id_seq OWNED BY public.comentarios.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: dispositivos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dispositivos (
    id integer NOT NULL,
    nombre character varying(200) NOT NULL,
    marca character varying(100),
    tipo character varying(50),
    fecha_lanzamiento date,
    precio numeric(10,2),
    imagen_url text,
    descripcion text,
    especificaciones text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.dispositivos OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: dispositivos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dispositivos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dispositivos_id_seq OWNER TO postgres;

--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 219
-- Name: dispositivos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dispositivos_id_seq OWNED BY public.dispositivos.id;


--
-- TOC entry 4863 (class 2604 OID 16405)
-- Name: comentarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentarios ALTER COLUMN id SET DEFAULT nextval('public.comentarios_id_seq'::regclass);


--
-- TOC entry 4861 (class 2604 OID 16393)
-- Name: dispositivos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dispositivos ALTER COLUMN id SET DEFAULT nextval('public.dispositivos_id_seq'::regclass);


--
-- TOC entry 5020 (class 0 OID 16402)
-- Dependencies: 222
-- Data for Name: comentarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comentarios (id, dispositivo_id, nombre_usuario, comentario, fecha) FROM stdin;
1	1	Ana P‚rez	La c mara es espectacular, pero la bater¡a podr¡a durar m s. El titanio se siente muy premium.	2026-02-15 19:04:07.876663
2	1	Carlos L¢pez	El chip A17 Pro es un monstruo, corre cualquier juego sin problemas.	2026-02-15 19:04:07.876663
3	2	Mar¡a Garc¡a	La IA de Samsung es impresionante, traduce llamadas en tiempo real.	2026-02-15 19:04:07.876663
4	3	Juan Rodr¡guez	Para edici¢n de video es lo mejor que hay, pero el precio duele un poco.	2026-02-15 19:04:07.876663
5	4	Laura Mart¡nez	Google hizo un trabajo incre¡ble con la c mara, las fotos nocturnas son de otro nivel.	2026-02-15 19:04:07.876663
6	3	Carlos perez	gran portatil	2026-02-17 21:09:59.184731
7	2	Camilo Suarez	Prueba de comentario en pagina WEB	2026-02-21 11:30:02.611007
8	3	Camilo Suarez	Prueba de comentario gran PC	2026-02-21 11:37:58.045056
\.


--
-- TOC entry 5018 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: dispositivos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dispositivos (id, nombre, marca, tipo, fecha_lanzamiento, precio, imagen_url, descripcion, especificaciones, fecha_creacion) FROM stdin;
3	MacBook Pro 16"	Apple	Port til	2023-10-31	1900000.00	https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673229	Potencia brutal con chip M3 Max, ideal para profesionales creativos.	\N	2026-02-15 19:03:59.054805
4	Pixel 8 Pro	Google	Celular	2023-10-12	3900000.00	data:image/webp;base64,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	La mejor c mara con IA de Google, 7 a¤os de actualizaciones.	\N	2026-02-15 19:03:59.054805
1	iPhone 15 Pro	Apple	Celular	2023-09-22	1000000.00	https://th.bing.com/th/id/OIP.YEc6wR-h1aLzYuDS2rVmcAHaE8?w=209&h=180&c=7&r=0&o=7&pid=1.7&rm=3	El iPhone 15 Pro presenta un dise¤o de titanio, el chip A17 Pro y un sistema de c maras profesional.	\N	2026-02-15 19:03:59.054805
2	Galaxy S24 PLUS	Samsung	Celular	2026-02-21	20000000.00	https://th.bing.com/th/id/OIP.CBadCWMAADZgon3Vz7sJSwHaDt?w=315&h=180&c=7&r=0&o=7&pid=1.7&rm=3	El primer smartphone con Galaxy AI, c mara de 200MP y S-Pen integrado.	lanzamiento este 2026	2026-02-15 19:03:59.054805
\.


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 221
-- Name: comentarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comentarios_id_seq', 8, true);


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 219
-- Name: dispositivos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dispositivos_id_seq', 4, true);


--
-- TOC entry 4868 (class 2606 OID 16413)
-- Name: comentarios comentarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT comentarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4866 (class 2606 OID 16400)
-- Name: dispositivos dispositivos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dispositivos
    ADD CONSTRAINT dispositivos_pkey PRIMARY KEY (id);


--
-- TOC entry 4869 (class 2606 OID 16414)
-- Name: comentarios comentarios_dispositivo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT comentarios_dispositivo_id_fkey FOREIGN KEY (dispositivo_id) REFERENCES public.dispositivos(id) ON DELETE CASCADE;


-- Completed on 2026-03-13 14:53:47

--
-- PostgreSQL database dump complete
--

\unrestrict EEfFCJOkFRjDZeRBQ4NDyRRPDk5vnBR3MyP1hZd2MM6DzgTtegBiAWqRyH6nPIZ

