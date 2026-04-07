import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5">
        <h1 className="text-2xl font-bold">Chinu Inventory</h1>
        <div className="space-x-4">
          <Button variant="ghost">Login</Button>
          <Button>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center px-6 mt-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold leading-tight"
        >
          Manage Your Shop Smarter 🚀
        </motion.h2>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Inventory, Orders, Billing, and Reports — everything your shop needs in one powerful system.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button className="px-6 py-3 text-lg">Start Free</Button>
          <Button variant="outline" className="px-6 py-3 text-lg">View Demo</Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 px-8 mt-24">
        {[
          {
            title: "Inventory Management",
            desc: "Track stock, get low stock alerts, and manage products easily."
          },
          {
            title: "Order Management",
            desc: "Create, edit, and track orders with real-time updates."
          },
          {
            title: "Reports & Analytics",
            desc: "Understand profits, best-selling products, and growth trends."
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-gray-600">{feature.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="text-center mt-24 px-6">
        <h2 className="text-3xl font-bold">Ready to grow your business?</h2>
        <p className="mt-4 text-gray-600">Start using Chinu Inventory today.</p>
        <Button className="mt-6 px-8 py-3 text-lg">Get Started</Button>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-500 pb-6">
        © {new Date().getFullYear()} Chinu Inventory. All rights reserved.
      </footer>
    </div>
  );
}
