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

DROP DATABASE app;
--
-- Name: app; Type: DATABASE; Schema: -; Owner: root
--

CREATE DATABASE app WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE app OWNER TO root;

\connect app

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Adresses; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Adresses" (
                                   id uuid NOT NULL,
                                   rue character varying(255) NOT NULL,
                                   numero character varying(255) NOT NULL,
                                   adresse character varying(255) NOT NULL,
                                   ville character varying(255) NOT NULL,
                                   "codePostal" character varying(255) NOT NULL,
                                   "createdAt" timestamp with time zone NOT NULL,
                                   "updatedAt" timestamp with time zone NOT NULL,
                                   "userId" uuid
);


ALTER TABLE public."Adresses" OWNER TO root;

--
-- Name: Categories; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Categories" (
                                     id uuid NOT NULL,
                                     nom character varying(255) NOT NULL,
                                     description text,
                                     "createdAt" timestamp with time zone NOT NULL,
                                     "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Categories" OWNER TO root;

--
-- Name: Commandes; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Commandes" (
                                    id uuid NOT NULL,
                                    statut character varying(255) NOT NULL,
                                    "dateCommande" timestamp with time zone NOT NULL,
                                    "dateLivraisonPrevue" timestamp with time zone,
                                    "dateLivraisonFinale" timestamp with time zone,
                                    "createdAt" timestamp with time zone NOT NULL,
                                    "updatedAt" timestamp with time zone NOT NULL,
                                    "userId" uuid,
                                    "panierId" uuid
);


ALTER TABLE public."Commandes" OWNER TO root;

--
-- Name: DemandesRGPD; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."DemandesRGPD" (
                                       id uuid NOT NULL,
                                       statut character varying(255) NOT NULL,
                                       "typeDemande" character varying(255) NOT NULL,
                                       "dateTraitement" timestamp with time zone,
                                       "createdAt" timestamp with time zone NOT NULL,
                                       "updatedAt" timestamp with time zone NOT NULL,
                                       "userId" uuid
);


ALTER TABLE public."DemandesRGPD" OWNER TO root;

--
-- Name: Factures; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Factures" (
                                   id uuid NOT NULL,
                                   numero character varying(255) NOT NULL,
                                   "dateFacturation" timestamp with time zone NOT NULL,
                                   "datePaiementDue" timestamp with time zone,
                                   "statutPaiement" character varying(255) NOT NULL,
                                   total double precision NOT NULL,
                                   "createdAt" timestamp with time zone NOT NULL,
                                   "updatedAt" timestamp with time zone NOT NULL,
                                   "userId" uuid
);


ALTER TABLE public."Factures" OWNER TO root;

--
-- Name: MethodesPaiement; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."MethodesPaiement" (
                                           id uuid NOT NULL,
                                           nom character varying(255) NOT NULL,
                                           "createdAt" timestamp with time zone NOT NULL,
                                           "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."MethodesPaiement" OWNER TO root;

--
-- Name: Paiements; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Paiements" (
                                    id uuid NOT NULL,
                                    "datePaiement" timestamp with time zone NOT NULL,
                                    montant double precision NOT NULL,
                                    "methodePaiementId" uuid,
                                    "createdAt" timestamp with time zone NOT NULL,
                                    "updatedAt" timestamp with time zone NOT NULL,
                                    "produitId" uuid
);


ALTER TABLE public."Paiements" OWNER TO root;

--
-- Name: Panier_Produits; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Panier_Produits" (
                                          "createdAt" timestamp with time zone NOT NULL,
                                          "updatedAt" timestamp with time zone NOT NULL,
                                          "panierId" uuid NOT NULL,
                                          "produitId" uuid NOT NULL
);


ALTER TABLE public."Panier_Produits" OWNER TO root;

--
-- Name: Paniers; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Paniers" (
                                  id uuid NOT NULL,
                                  "createdAt" timestamp with time zone NOT NULL,
                                  "updatedAt" timestamp with time zone NOT NULL,
                                  "userId" uuid
);


ALTER TABLE public."Paniers" OWNER TO root;

--
-- Name: Produits; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Produits" (
                                   id uuid NOT NULL,
                                   nom character varying(255) NOT NULL,
                                   description text,
                                   prix double precision NOT NULL,
                                   stock integer NOT NULL,
                                   marque character varying(255) NOT NULL,
                                   "isPromotion" boolean DEFAULT false,
                                   "pourcentagePromotion" integer DEFAULT 0,
                                   "createdAt" timestamp with time zone NOT NULL,
                                   "updatedAt" timestamp with time zone NOT NULL,
                                   "categorieId" uuid
);


ALTER TABLE public."Produits" OWNER TO root;

--
-- Name: Promotions; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Promotions" (
                                     id uuid NOT NULL,
                                     remise integer NOT NULL,
                                     "dateFin" timestamp with time zone NOT NULL,
                                     "dateDebut" timestamp with time zone NOT NULL,
                                     "createdAt" timestamp with time zone NOT NULL,
                                     "updatedAt" timestamp with time zone NOT NULL,
                                     "produitId" uuid
);


ALTER TABLE public."Promotions" OWNER TO root;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Users" (
                                id uuid NOT NULL,
                                nom character varying(255) NOT NULL,
                                prenom character varying(255) NOT NULL,
                                email character varying(255) NOT NULL,
                                password character varying(255) NOT NULL,
                                telephone character varying(255) NOT NULL,
                                role character varying(255) DEFAULT 'ROLE_USER'::character varying NOT NULL,
                                "haveConsented" boolean DEFAULT false,
                                "isVerified" boolean DEFAULT false,
                                "isBlocked" boolean DEFAULT false,
                                "createdAt" timestamp with time zone NOT NULL,
                                "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO root;

--
-- Name: Adresses Adresses_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Adresses"
    ADD CONSTRAINT "Adresses_pkey" PRIMARY KEY (id);


--
-- Name: Categories Categories_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_pkey" PRIMARY KEY (id);


--
-- Name: Commandes Commandes_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Commandes"
    ADD CONSTRAINT "Commandes_pkey" PRIMARY KEY (id);


--
-- Name: DemandesRGPD DemandesRGPD_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."DemandesRGPD"
    ADD CONSTRAINT "DemandesRGPD_pkey" PRIMARY KEY (id);


--
-- Name: Factures Factures_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Factures"
    ADD CONSTRAINT "Factures_pkey" PRIMARY KEY (id);


--
-- Name: MethodesPaiement MethodesPaiement_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."MethodesPaiement"
    ADD CONSTRAINT "MethodesPaiement_pkey" PRIMARY KEY (id);


--
-- Name: Paiements Paiements_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Paiements"
    ADD CONSTRAINT "Paiements_pkey" PRIMARY KEY (id);


--
-- Name: Panier_Produits Panier_Produits_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Panier_Produits"
    ADD CONSTRAINT "Panier_Produits_pkey" PRIMARY KEY ("panierId", "produitId");


--
-- Name: Paniers Paniers_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Paniers"
    ADD CONSTRAINT "Paniers_pkey" PRIMARY KEY (id);


--
-- Name: Produits Produits_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Produits"
    ADD CONSTRAINT "Produits_pkey" PRIMARY KEY (id);


--
-- Name: Promotions Promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Promotions"
    ADD CONSTRAINT "Promotions_pkey" PRIMARY KEY (id);


--
-- Name: Commandes Commandes_panierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Commandes"
    ADD CONSTRAINT "Commandes_panierId_fkey" FOREIGN KEY ("panierId") REFERENCES public."Paniers"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Paiements Paiements_methodePaiementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Paiements"
    ADD CONSTRAINT "Paiements_methodePaiementId_fkey" FOREIGN KEY ("methodePaiementId") REFERENCES public."MethodesPaiement"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Paiements Paiements_produitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Paiements"
    ADD CONSTRAINT "Paiements_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES public."Produits"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Panier_Produits Panier_Produits_panierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Panier_Produits"
    ADD CONSTRAINT "Panier_Produits_panierId_fkey" FOREIGN KEY ("panierId") REFERENCES public."Paniers"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Panier_Produits Panier_Produits_produitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Panier_Produits"
    ADD CONSTRAINT "Panier_Produits_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES public."Produits"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Produits Produits_categorieId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Produits"
    ADD CONSTRAINT "Produits_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES public."Categories"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Promotions Promotions_produitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Promotions"
    ADD CONSTRAINT "Promotions_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES public."Produits"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

