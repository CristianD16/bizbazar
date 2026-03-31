-- BizBazar Seed Data

-- Categories
INSERT INTO categories (name) VALUES
  ('Restaurantes y Alimentos'),
  ('E-commerce'),
  ('Franquicias'),
  ('Servicios Profesionales'),
  ('Salud y Bienestar'),
  ('Tecnología'),
  ('Educación')
ON CONFLICT (name) DO NOTHING;

-- Countries
INSERT INTO countries (name) VALUES
  ('Chile'),
  ('Argentina'),
  ('Colombia'),
  ('Perú')
ON CONFLICT (name) DO NOTHING;

-- Locations
INSERT INTO locations (city, region, country_id) VALUES
  ('Santiago',      'Región Metropolitana', (SELECT id FROM countries WHERE name = 'Chile')),
  ('Viña del Mar',  'Valparaíso',           (SELECT id FROM countries WHERE name = 'Chile')),
  ('Concepción',    'Biobío',               (SELECT id FROM countries WHERE name = 'Chile')),
  ('Valdivia',      'Los Ríos',             (SELECT id FROM countries WHERE name = 'Chile')),
  ('Buenos Aires',  'Buenos Aires',         (SELECT id FROM countries WHERE name = 'Argentina')),
  ('Medellín',      'Antioquia',            (SELECT id FROM countries WHERE name = 'Colombia')),
  ('Lima',          'Lima',                 (SELECT id FROM countries WHERE name = 'Perú'))
ON CONFLICT (city, region, country_id) DO NOTHING;

-- Sellers
INSERT INTO sellers (name, verified) VALUES
  ('María González',        true),
  ('Carlos Muñoz',          true),
  ('Franquicias LavaExpress', true),
  ('Rodrigo Soto',          true),
  ('Patricia Hernández',    false),
  ('Camila Reyes',          true),
  ('Helados del Sur SpA',   true),
  ('Tech Solutions LATAM',  true),
  ('Valentina Pizarro',     true),
  ('Gourmet Perú SAC',      true),
  ('EnglishNow SpA',        true),
  ('GreenBowl SpA',         true);

-- Listings
INSERT INTO listings
  (title, type, category_id, description, asking_price, currency,
   monthly_revenue, monthly_profit, employees, year_established,
   location_id, seller_id, featured, created_at)
VALUES
  (
    'Café Premium en Providencia',
    'sme',
    (SELECT id FROM categories WHERE name = 'Restaurantes y Alimentos'),
    'Café boutique establecido hace 5 años en una de las zonas más transitadas de Providencia, Santiago. Clientela fiel, excelente reputación en Google Maps (4.8 estrellas). Incluye equipamiento completo, marca registrada y contrato de arriendo favorable por 3 años más.',
    45000000, 'CLP', 8500000, 2800000, 6, 2021,
    (SELECT id FROM locations WHERE city = 'Santiago'),
    (SELECT id FROM sellers  WHERE name = 'María González'),
    true,
    '2026-03-15T10:00:00Z'
  ),
  (
    'Tienda E-commerce de Ropa Deportiva',
    'ecommerce',
    (SELECT id FROM categories WHERE name = 'E-commerce'),
    'Tienda online de ropa deportiva con presencia en Chile y Perú. Más de 15,000 clientes registrados, integración con Shopify, MercadoLibre y Falabella Marketplace. Inventario valorado en $5M CLP incluido. Marca con fuerte presencia en Instagram (25K seguidores).',
    32000000, 'CLP', 12000000, 3500000, 3, 2022,
    (SELECT id FROM locations WHERE city = 'Santiago'),
    (SELECT id FROM sellers  WHERE name = 'Carlos Muñoz'),
    true,
    '2026-03-10T14:30:00Z'
  ),
  (
    'Franquicia de Lavandería Autoservicio',
    'franchise',
    (SELECT id FROM categories WHERE name = 'Franquicias'),
    'Oportunidad de franquicia de lavandería autoservicio con modelo probado en 12 locales a nivel nacional. Inversión incluye equipamiento, capacitación, soporte operativo continuo y territorio exclusivo. ROI promedio de 18 meses.',
    28000000, 'CLP', 6000000, 2200000, 2, 2019,
    (SELECT id FROM locations WHERE city = 'Viña del Mar'),
    (SELECT id FROM sellers  WHERE name = 'Franquicias LavaExpress'),
    false,
    '2026-03-08T09:00:00Z'
  ),
  (
    'Agencia de Marketing Digital',
    'sme',
    (SELECT id FROM categories WHERE name = 'Servicios Profesionales'),
    'Agencia de marketing digital con cartera de 35 clientes activos, contratos mensuales recurrentes. Especializada en SEO, SEM y redes sociales para el mercado chileno y colombiano. Equipo remoto consolidado, operación 100% digital.',
    65000000, 'CLP', 15000000, 6500000, 8, 2020,
    (SELECT id FROM locations WHERE city = 'Santiago'),
    (SELECT id FROM sellers  WHERE name = 'Rodrigo Soto'),
    true,
    '2026-03-12T11:00:00Z'
  ),
  (
    'Farmacia Independiente en Concepción',
    'sme',
    (SELECT id FROM categories WHERE name = 'Salud y Bienestar'),
    'Farmacia independiente con 8 años de operación en barrio residencial de Concepción. Licencias al día, sistema de gestión de inventario, base de clientes leales. Ubicación estratégica cerca de centros médicos.',
    55000000, 'CLP', 22000000, 4000000, 5, 2018,
    (SELECT id FROM locations WHERE city = 'Concepción'),
    (SELECT id FROM sellers  WHERE name = 'Patricia Hernández'),
    false,
    '2026-03-05T16:00:00Z'
  ),
  (
    'Tienda Online de Productos Orgánicos',
    'ecommerce',
    (SELECT id FROM categories WHERE name = 'E-commerce'),
    'E-commerce de productos orgánicos y naturales con despacho a todo Chile. Alianzas con más de 40 productores locales. Plataforma propia en WooCommerce, sistema de suscripción mensual con 800 suscriptores activos.',
    18000000, 'CLP', 7500000, 2000000, 4, 2023,
    (SELECT id FROM locations WHERE city = 'Valdivia'),
    (SELECT id FROM sellers  WHERE name = 'Camila Reyes'),
    false,
    '2026-03-01T08:00:00Z'
  ),
  (
    'Franquicia de Heladería Artesanal',
    'franchise',
    (SELECT id FROM categories WHERE name = 'Franquicias'),
    'Franquicia de heladería artesanal con presencia en Chile, Argentina y Perú. Más de 50 sabores únicos, capacitación completa, diseño de local incluido. Marca reconocida con fuerte presencia en redes sociales.',
    38000000, 'CLP', 9000000, 3200000, 5, 2017,
    (SELECT id FROM locations WHERE city = 'Buenos Aires'),
    (SELECT id FROM sellers  WHERE name = 'Helados del Sur SpA'),
    true,
    '2026-03-14T13:00:00Z'
  ),
  (
    'Software SaaS para Gestión de Pymes',
    'ecommerce',
    (SELECT id FROM categories WHERE name = 'Tecnología'),
    'Plataforma SaaS de gestión empresarial para pymes con 1,200 usuarios activos pagando suscripción mensual. Facturación electrónica, inventario, CRM y reportes. Stack moderno (React + Node.js). MRR de $4.5M CLP.',
    120000000, 'CLP', 4500000, 3200000, 4, 2021,
    (SELECT id FROM locations WHERE city = 'Medellín'),
    (SELECT id FROM sellers  WHERE name = 'Tech Solutions LATAM'),
    false,
    '2026-02-28T10:00:00Z'
  ),
  (
    'Centro de Estética y Spa',
    'sme',
    (SELECT id FROM categories WHERE name = 'Salud y Bienestar'),
    'Centro de estética integral en Las Condes con 6 cabinas de tratamiento, equipamiento de última generación. Cartera de más de 2,000 clientas activas. Ubicación premium con estacionamiento propio.',
    78000000, 'CLP', 18000000, 5500000, 10, 2019,
    (SELECT id FROM locations WHERE city = 'Santiago'),
    (SELECT id FROM sellers  WHERE name = 'Valentina Pizarro'),
    false,
    '2026-03-07T15:00:00Z'
  ),
  (
    'Distribuidora de Alimentos Gourmet',
    'sme',
    (SELECT id FROM categories WHERE name = 'Restaurantes y Alimentos'),
    'Distribuidora de alimentos gourmet e importados con red de más de 150 clientes entre restaurantes, hoteles y tiendas especializadas en Lima. Bodega propia de 500m², flota de 3 vehículos refrigerados incluida.',
    95000000, 'CLP', 35000000, 7000000, 12, 2016,
    (SELECT id FROM locations WHERE city = 'Lima'),
    (SELECT id FROM sellers  WHERE name = 'Gourmet Perú SAC'),
    false,
    '2026-02-25T12:00:00Z'
  ),
  (
    'Academia de Inglés Online',
    'ecommerce',
    (SELECT id FROM categories WHERE name = 'Educación'),
    'Academia de inglés 100% online con más de 3,000 estudiantes activos en Chile, Colombia y México. Plataforma propia con clases en vivo y contenido grabado. 15 profesores nativos. Fuerte crecimiento mes a mes.',
    52000000, 'CLP', 11000000, 4200000, 18, 2022,
    (SELECT id FROM locations WHERE city = 'Santiago'),
    (SELECT id FROM sellers  WHERE name = 'EnglishNow SpA'),
    false,
    '2026-03-03T09:30:00Z'
  ),
  (
    'Franquicia de Comida Rápida Saludable',
    'franchise',
    (SELECT id FROM categories WHERE name = 'Franquicias'),
    'Franquicia de fast food saludable con concepto único en el mercado latinoamericano. 8 locales operando exitosamente. Menú basado en bowls, wraps y jugos naturales. Inversión incluye local llave en mano.',
    42000000, 'CLP', 10000000, 3000000, 7, 2020,
    (SELECT id FROM locations WHERE city = 'Santiago'),
    (SELECT id FROM sellers  WHERE name = 'GreenBowl SpA'),
    true,
    '2026-03-13T10:00:00Z'
  );

-- Tags
INSERT INTO tags (name) VALUES
  ('café'), ('restaurante'), ('providencia'), ('santiago'),
  ('ecommerce'), ('ropa'), ('deportiva'), ('shopify'),
  ('franquicia'), ('lavandería'), ('autoservicio'),
  ('marketing'), ('digital'), ('agencia'), ('servicios'),
  ('farmacia'), ('salud'), ('concepción'),
  ('orgánico'), ('natural'), ('suscripción'),
  ('heladería'), ('artesanal'), ('argentina'),
  ('saas'), ('software'), ('pymes'), ('tecnología'),
  ('estética'), ('spa'), ('belleza'), ('las condes'),
  ('distribuidora'), ('alimentos'), ('gourmet'), ('perú'),
  ('educación'), ('inglés'), ('online'), ('academia'),
  ('comida'), ('saludable'), ('fast food')
ON CONFLICT (name) DO NOTHING;

-- Listing ↔ Tags
INSERT INTO listing_tags (listing_id, tag_id)
SELECT l.id, t.id FROM listings l, tags t
WHERE l.title = 'Café Premium en Providencia'
  AND t.name IN ('café', 'restaurante', 'providencia', 'santiago');

INSERT INTO listing_tags (listing_id, tag_id)
SELECT l.id, t.id FROM listings l, tags t
WHERE l.title = 'Tienda E-commerce de Ropa Deportiva'
  AND t.name IN ('ecommerce', 'ropa', 'deportiva', 'shopify');

INSERT INTO listing_tags (listing_id, tag_id)
SELECT l.id, t.id FROM listings l, tags t
WHERE l.title = 'Franquicia de Lavandería Autoservicio'
  AND t.name IN ('franquicia', 'lavandería', 'autoservicio');

INSERT INTO listing_tags (listing_id, tag_id)
SELECT l.id, t.id FROM listings l, tags t
WHERE l.title = 'Agencia de Marketing Digital'
  AND t.name IN ('marketing', 'digital', 'agencia', 'servicios');

INSERT INTO listing_tags (listing_id, tag_id)
SELECT l.id, t.id FROM listings l, tags t
WHERE l.title = 'Farmacia Independiente en Concepción'
  AND t.name IN ('farmacia', 'salud', 'concepción');

INSERT INTO listing_tags (listing_id, tag_id)
SELECT l.id, t.id FROM listings l, tags t
WHERE l.title = 'Tienda Online de Productos Orgánicos'
  AND t.name IN ('orgánico', 'ecommerce', 'natural', 'suscripción');

INSERT INTO listing_tags (listing_id, tag_id)
SELECT l.id, t.id FROM listings l, tags t
WHERE l.title = 'Franquicia de Heladería Artesanal'
  AND t.name IN ('franquicia', 'heladería', 'artesanal', 'argentina');

INSERT INTO listing_tags (listing_id, tag_id)
SELECT l.id, t.id FROM listings l, tags t
WHERE l.title = 'Software SaaS para Gestión de Pymes'
  AND t.name IN ('saas', 'software', 'pymes', 'tecnología');

INSERT INTO listing_tags (listing_id, tag_id)
SELECT l.id, t.id FROM listings l, tags t
WHERE l.title = 'Centro de Estética y Spa'
  AND t.name IN ('estética', 'spa', 'belleza', 'las condes');

INSERT INTO listing_tags (listing_id, tag_id)
SELECT l.id, t.id FROM listings l, tags t
WHERE l.title = 'Distribuidora de Alimentos Gourmet'
  AND t.name IN ('distribuidora', 'alimentos', 'gourmet', 'perú');

INSERT INTO listing_tags (listing_id, tag_id)
SELECT l.id, t.id FROM listings l, tags t
WHERE l.title = 'Academia de Inglés Online'
  AND t.name IN ('educación', 'inglés', 'online', 'academia');

INSERT INTO listing_tags (listing_id, tag_id)
SELECT l.id, t.id FROM listings l, tags t
WHERE l.title = 'Franquicia de Comida Rápida Saludable'
  AND t.name IN ('franquicia', 'comida', 'saludable', 'fast food');
