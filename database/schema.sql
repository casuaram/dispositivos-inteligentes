-- =========================================
-- CONFIGURACIÓN
-- =========================================

SET client_encoding = 'UTF8';

-- =========================================
-- TABLA DISPOSITIVOS
-- =========================================

CREATE TABLE IF NOT EXISTS public.dispositivos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    marca VARCHAR(100),
    tipo VARCHAR(50),
    fecha_lanzamiento DATE,
    precio NUMERIC(10,2),
    imagen_url TEXT,
    descripcion TEXT,
    especificaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- TABLA COMENTARIOS
-- =========================================

CREATE TABLE IF NOT EXISTS public.comentarios (
    id SERIAL PRIMARY KEY,
    dispositivo_id INTEGER,
    nombre_usuario VARCHAR(100) NOT NULL,
    comentario TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT comentarios_dispositivo_id_fkey
        FOREIGN KEY (dispositivo_id)
        REFERENCES public.dispositivos(id)
        ON DELETE CASCADE
);

-- =========================================
-- DATOS DISPOSITIVOS
-- =========================================

INSERT INTO public.dispositivos
(id,nombre,marca,tipo,fecha_lanzamiento,precio,imagen_url,descripcion,especificaciones,fecha_creacion)
VALUES
(1,'iPhone 15 Pro','Apple','Celular','2023-09-22',1000000.00,
'https://th.bing.com/th/id/OIP.YEc6wR-h1aLzYuDS2rVmcAHaE8?w=209&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
'El iPhone 15 Pro presenta un diseño de titanio, el chip A17 Pro y un sistema de cámaras profesional.',
NULL,'2026-02-15 19:03:59'),

(2,'Galaxy S24 PLUS','Samsung','Celular','2026-02-21',20000000.00,
'https://th.bing.com/th/id/OIP.CBadCWMAADZgon3Vz7sJSwHaDt?w=315&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
'El primer smartphone con Galaxy AI, cámara de 200MP y S-Pen integrado.',
'lanzamiento este 2026','2026-02-15 19:03:59'),

(3,'MacBook Pro 16"','Apple','Portátil','2023-10-31',1900000.00,
'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673229',
'Potencia brutal con chip M3 Max, ideal para profesionales creativos.',
NULL,'2026-02-15 19:03:59'),

(4,'Pixel 8 Pro','Google','Celular','2023-10-12',3900000.00,
'https://store.google.com/product/pixel_8_pro',
'La mejor cámara con IA de Google, 7 años de actualizaciones.',
NULL,'2026-02-15 19:03:59');

-- =========================================
-- DATOS COMENTARIOS
-- =========================================

INSERT INTO public.comentarios
(id,dispositivo_id,nombre_usuario,comentario,fecha)
VALUES
(1,1,'Ana Pérez',
'La cámara es espectacular, pero la batería podría durar más. El titanio se siente muy premium.',
'2026-02-15 19:04:07'),

(2,1,'Carlos López',
'El chip A17 Pro es un monstruo, corre cualquier juego sin problemas.',
'2026-02-15 19:04:07'),

(3,2,'María García',
'La IA de Samsung es impresionante, traduce llamadas en tiempo real.',
'2026-02-15 19:04:07'),

(4,3,'Juan Rodríguez',
'Para edición de video es lo mejor que hay, pero el precio duele un poco.',
'2026-02-15 19:04:07'),

(5,4,'Laura Martínez',
'Google hizo un trabajo increíble con la cámara, las fotos nocturnas son de otro nivel.',
'2026-02-15 19:04:07'),

(6,3,'Carlos Perez','gran portatil','2026-02-17 21:09:59'),

(7,2,'Camilo Suarez','Prueba de comentario en pagina WEB','2026-02-21 11:30:02'),

(8,3,'Camilo Suarez','Prueba de comentario gran PC','2026-02-21 11:37:58');

-- =========================================
-- AJUSTAR SECUENCIAS
-- =========================================

SELECT setval(pg_get_serial_sequence('public.dispositivos','id'),4);
SELECT setval(pg_get_serial_sequence('public.comentarios','id'),8);