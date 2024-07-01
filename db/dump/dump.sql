--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3 (Debian 16.3-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Users" (id, nom, prenom, email, password, telephone, role, "haveConsented", "isVerified", "isBlocked", "createdAt", "updatedAt") FROM stdin;
2ae077c0-34c6-4614-a9d1-7946884a4985	Rek	Saf	smrekik@sqli.com	$2a$05$7HbRut/rfeGNPjIcfIMyle9ydPFRl4OhZkXYOtPy8sSXqWHSz89gK	0100110011	ROLE_USER	t	t	f	2024-06-11 08:21:52.218+00	2024-06-11 08:21:52.218+00
\.


--
-- Data for Name: Adresses; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Adresses" (id, rue, numero, adresse, ville, "codePostal", "createdAt", "updatedAt", "userId") FROM stdin;
\.


--
-- Data for Name: Categories; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Categories" (id, nom, description, "createdAt", "updatedAt") FROM stdin;
5523e842-2e95-3d2b-b397-a25313baf3ca	Category 1	Test category 1	2024-06-11 11:35:06.174+00	2024-06-11 11:35:08.104+00
\.


--
-- Data for Name: Paniers; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Paniers" (id, "createdAt", "updatedAt", "userId") FROM stdin;
\.


--
-- Data for Name: Commandes; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Commandes" (id, statut, "dateCommande", "dateLivraisonPrevue", "dateLivraisonFinale", "createdAt", "updatedAt", "userId", "panierId") FROM stdin;
\.


--
-- Data for Name: DemandesRGPD; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."DemandesRGPD" (id, statut, "typeDemande", "dateTraitement", "createdAt", "updatedAt", "userId") FROM stdin;
\.


--
-- Data for Name: Factures; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Factures" (id, numero, "dateFacturation", "datePaiementDue", "statutPaiement", total, "createdAt", "updatedAt", "userId") FROM stdin;
\.


--
-- Data for Name: MethodesPaiement; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."MethodesPaiement" (id, nom, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Produits; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Produits" (id, nom, description, prix, stock, marque, "isPromotion", "pourcentagePromotion", "createdAt", "updatedAt", "categorieId") FROM stdin;
3b52f6c7-0dc1-345b-8a84-93c2f1338c57	Test produit 1	Description produit 1	10	3	Apple	f	0	2024-06-11 00:00:00+00	2024-06-11 00:00:00+00	5523e842-2e95-3d2b-b397-a25313baf3ca
e4790b92-bcec-3f42-8e18-500cc4d6aad9	Test produit 2	Description produit 2	20	5	Samsung	f	0	2024-06-11 00:00:00+00	2024-06-11 00:00:00+00	5523e842-2e95-3d2b-b397-a25313baf3ca
\.


--
-- Data for Name: Paiements; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Paiements" (id, "datePaiement", montant, "methodePaiementId", "createdAt", "updatedAt", "produitId") FROM stdin;
\.


--
-- Data for Name: Panier_Produits; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Panier_Produits" ("createdAt", "updatedAt", "panierId", "produitId") FROM stdin;
\.


--
-- Data for Name: Promotions; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Promotions" (id, remise, "dateFin", "dateDebut", "createdAt", "updatedAt", "produitId") FROM stdin;
\.


--
-- PostgreSQL database dump complete
--

