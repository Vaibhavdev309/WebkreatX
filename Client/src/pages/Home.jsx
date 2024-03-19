import React from "react";
import Hero from "../components/Home/Hero";
import About from "../components/Home/About";
import Footer from "../components/Home/Footer";
import Services from "../components/Home/Services";
import ContactForm from "../components/Home/ContactForm";
import FAQ from "../components/Home/FAQ";
import Navbar from "../components/Navbar/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <FAQ />
      <ContactForm />
      <Footer />
    </div>
  );
}
