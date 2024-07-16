import React from 'react';
import Header from './Header';
import Nav from './Nav';
import Feature from './Feature';
import Footer from './Footer';

function Home() {
  return (
    <div>
      <Header />
      <Nav />
      <div className="container">
        <section id="features">
          <h2>Features</h2>
          <div className="features">
            <Feature title="User Authentication" description="Secure user login and registration using JWT." link="/login" />
            <Feature title="Income and Expense Tracking" description="Keep track of your income and expenses with detailed records." link="/transactions" />
            <Feature title="Budget Setting" description="Set and monitor your budget to achieve your financial goals." link="/budget" />
            <Feature title="Visual Analytics" description="Get insights into your spending habits with charts and graphs." link="/analytics" />
            <Feature title="Responsive Design" description="Access your financial data on any device, anywhere." link="/responsive" />
            <Feature title="Secure Data Handling" description="Protect your sensitive financial information with secure data handling practices." link="/security" />
          </div>
        </section>

        <section id="about">
          <h2>About</h2>
          <p>The Personal Finance Tracker is designed to help users manage their finances effectively. Our tool provides
            users with the ability to track their income and expenses, set budgets, and visualize their financial data
            through insightful charts and graphs. With a focus on security and ease of use, our application ensures that
            users can confidently manage their financial information.</p>
        </section>

        <section id="contact">
          <h2>Contact</h2>
          <p>For more information or support, please contact us at <a href="mailto:support@finance-tracker.com">support@finance-tracker.com</a>.</p>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
