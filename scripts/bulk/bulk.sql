-- Insert customers
INSERT INTO MASTER.customers (name, nif, industry, phone, email, currency, currency_iso, description, owner_id)
VALUES
('AIRPHARM', '', 'Pharmaceutical', '93 264 19 19', '', '', '', '', '63'),
('ALDISCA', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('BEMAR ADUANAS', '', 'Pharmaceutical', '637 21 35 29', '', '', '', '', '63'),
('CLINICA ESMEDIC', '', 'Pharmaceutical', '972 09 34 08', '', '', '', '', '63'),
('DAU', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('DAU - DENTAID', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('DAU - GENSENTA', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('DAU - LORIEN', '', 'Pharmaceutical', '93 300 08 58', '', '', '', '', '63'),
('DAU-INTAS', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('DR/AB MAURI', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('ESTEVE QUIMICA S.A.', 'A08335671', 'Pharmaceutical', '', '', '', '', '', '63'),
('GENSENTA PHARMACEUTICALS', '', 'Pharmaceutical', '(212)3373800', '', '', '', '', '63'),
('I+D LICONSA', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('INDUSTRIAL VETERINARIA, S.A (M.P.)', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('INTERNATIONAL PHARMA TRADE', '', 'Pharmaceutical', '', 'info@internationalpharmatrade.com', '', '', '', '63'),
('INVESA ANIMEDICA', 'A-08630667', 'Pharmaceutical', '', '', '', '', '', '63'),
('ISS GLOBAL', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('KROMTON - SAFIC', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('KYKEON ANALYTICS', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('LIVISTO LAME/ADT', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('MPA VETERINARY', '', 'Pharmaceutical', '937 47 96 59', '', '', '', '', '63'),
('NEUROCIENCIA EXTAVIA', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('NOVARTIS FARMACÉUTICA S.A', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('NOVARTIS ICRO', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('PROFARMACO S.A.', '', 'Pharmaceutical', '934 147 009', '', '', '', '', '63'),
('PROFESSIONAL DERMA', '', 'Pharmaceutical', '', 'info@pderma.it', '', '', '', '63'),
('TEKNOKROMA ANALITICA', '', 'Pharmaceutical', '936748800', '', '', '', '', '63'),
('TIAF', '', 'Pharmaceutical', '935 65 00 48', '', '', '', '', '63'),
('TRANSGLORY S.A.', 'A60973906', 'Pharmaceutical', '+34 93554050', '', '', '', '', '63'),
('VIDARA ADUANAS', '', 'Pharmaceutical', '', '', '', '', '', '63'),
('ZENIT PHARMA', '', 'Pharmaceutical', '', '', '', '', '', '63');

-- Insert customer addresses
INSERT INTO MASTER.customer_addresses (customer_id, type, street, city_id, state_id, country_id, postal_code, group_code, fax, email, phone)
VALUES
(574, 'Billing', 'Paseo de la Zona Franca, 46', '881', '9', '62', '08038', '', '93 264 19 00', 'airpharm@airpharmlogistics.com', '93 264 19 19'),
(575, 'Billing', 'CALLE 22 16-18', '881', '9', '62', '08040', '', '', '', ''),
(576, 'Billing', '', '881', '9', '62', '08006', '', '', '', '637 21 35 29'),
(577, 'Billing', 'Av. Vila de Blanes, 139', '2541', '20', '62', '17310', '', '', '', '972 09 34 08'),
(578, 'Billing', '', '881', '9', '62', '', '', '', '', ''),
(579, 'Billing', 'XX', '881', '9', '62', '', '', '', '', ''),
(580, 'Billing', '', '881', '9', '62', '', '', '', '', ''),
(581, 'Billing', 'Carrer C, 12-14', '881', '9', '62', '08040', '', '', '', '93 300 08 58'),
(582, 'Billing', '', '881', '9', '62', '', '', '', '', ''),
(583, 'Billing', '', '881', '9', '62', '', '', '', '', ''),
(584, 'Billing', 'PASEO ZONA FRANCA 109, PLANTA 4', '881', '9', '62', '08038', '', '', '', ''),
(585, 'Billing', 'Levent Mah. Meltem Sok.', '8368', '90', '224', '', '', '(212)3373801', '', '(212)3373800'),
(586, 'Billing', '', '4353', '30', '62', '', '', '', '', ''),
(587, 'Billing', '', '881', '9', '62', '', '', '', '', ''),
(588, 'Billing', 'Office 202, 2nd  floor,Park Place Tower', '8369', '91', '58', '413459', '', '', 'info@internationalpharmatrade.com', ''),
(589, 'Billing', 'C/ESMERALDA, 19 - 21', '941', '9', '62', '08950', '', '', '', ''),
(590, 'Billing', 'Avda. Paral-lel , 21 , 3º 1ª', '881', '9', '62', '08004', '', '', '', ''),
(591, 'Billing', '', '881', '9', '62', '', '', '', '', ''),
(592, 'Billing', 'JAUME I EL CONQUERIDOR, Nº 18 BAJOS', '1158', '9', '62', '08500', '', '', '', ''),
(593, 'Billing', '', '881', '9', '62', '', '', '', '', ''),
(594, 'Billing', 'Carrer de Mogoda, nº 16', '1125', '9', '62', '08130', '', '', '', '937 47 96 59'),
(595, 'Billing', '', '881', '9', '62', '', '', '', '', ''),
(596, 'Billing', '', '881', '9', '62', '', '', '', '', ''),
(597, 'Billing', '', '881', '9', '62', '', '', '', '', ''),
(598, 'Billing', 'c/ Numancia, 187, 5ta planta', '881', '9', '62', '08034', '', '934 143 639', '', '934 147 009'),
(599, 'Billing', 'Via Umberto Giordano 82-84', '8370', '92', '62', '00124', '', '', 'info@pderma.it', ''),
(600, 'Billing', 'CAMÍ DE CAN CALDERS, 14', '1067', '9', '62', '08173', '', '', '', '936748800'),
(601, 'Billing', 'CALLE LA RIGOLA 43', '994', '9', '62', '08110', '', '', '', '935 65 00 48'),
(602, 'Billing', 'Calle Nyepa, 2-5', '1035', '9', '62', '08820', '', '93543326', '', '+34 93554050'),
(603, 'Billing', '', '881', '9', '62', '', '', '', '', ''),
(604, 'Billing', 'C/ Circunvalacion 15 - Local 3', '2683', '21', '62', '18620', '', '', '', '');

-- Insert customer SGA details
INSERT INTO MASTER.customers_sga (customer_id, sga_id, sga_name, warehouse_id)
VALUES
(574, '1000', 'AIRPHARM', 'SP'),
(575, '1188', 'ALDISCA', 'SP'),
(576, '1170', 'BEMAR ADUANAS', 'SP'),
(577, '1212', 'CLINICA ESMEDIC', 'SP'),
(578, '1205', 'DAU', 'SP'),
(579, '1204', 'DAU - DENTAID', 'SP'),
(580, '1141', 'DAU - GENSENTA', 'SP'),
(581, '1076', 'DAU - LORIEN', 'SP'),
(582, '1143', 'DAU-INTAS', 'SP'),
(583, '1213', 'DR/AB MAURI', 'SP'),
(584, '1191', 'ESTEVE QUIMICA S.A.', 'SP'),
(585, '1033', 'GENSENTA PHARMACEUTICALS', 'SP'),
(586, '1123', 'I+D LICONSA', 'SP'),
(587, '1005', 'INDUSTRIAL VETERINARIA, S.A (M.P.)', 'SP'),
(588, '1055', 'INTERNATIONAL PHARMA TRADE', 'SP'),
(589, '1011', 'INVESA ANIMEDICA', 'SP'),
(590, '1157', 'ISS GLOBAL', 'SP'),
(591, '1147', 'KROMTON - SAFIC', 'SP'),
(592, '1251', 'KYKEON ANALYTICS', 'SP'),
(593, '1231', 'LIVISTO LAME/ADT', 'SP'),
(594, '1135', 'MPA VETERINARY', 'SP'),
(595, '1025', 'NEUROCIENCIA EXTAVIA', 'SP'),
(596, '1018', 'NOVARTIS FARMACÉUTICA S.A', 'SP'),
(597, '1031', 'NOVARTIS ICRO', 'SP'),
(598, '1071', 'PROFARMACO S.A.', 'SP'),
(599, '1247', 'PROFESSIONAL DERMA', 'SP'),
(600, '1196', 'TEKNOKROMA ANALITICA', 'SP'),
(601, '1137', 'TIAF', 'SP'),
(602, '1084', 'TRANSGLORY S.A.', 'SP'),
(603, '1199', 'VIDARA ADUANAS', 'SP'),
(604, '1133', 'ZENIT PHARMA', 'SP');
