import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  TrendingUp,
  DollarSign,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    total: 895,
    status: "processing",
    date: "2024-02-15",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    total: 650,
    status: "shipped",
    date: "2024-02-14",
  },
  {
    id: "ORD-003",
    customer: "Bob Wilson",
    email: "bob@example.com",
    total: 485,
    status: "delivered",
    date: "2024-02-13",
  },
  {
    id: "ORD-004",
    customer: "Alice Brown",
    email: "alice@example.com",
    total: 295,
    status: "pending",
    date: "2024-02-13",
  },
];

const AdminDashboard = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();

  const sidebarLinks = [
    { icon: LayoutDashboard, label: t("dashboard"), href: "/admin" },
    { icon: Package, label: t("products"), href: "/admin/products" },
    { icon: ShoppingCart, label: t("orders"), href: "/admin/orders" },
    { icon: Users, label: t("customers"), href: "/admin/customers" },
    { icon: Settings, label: t("settings"), href: "/admin/settings" },
  ];

  const stats = [
    {
      label: t("totalRevenue"),
      value: "$45,231.89",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
    },
    {
      label: t("totalOrders"),
      value: "356",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      label: t("totalProducts"),
      value: products.length.toString(),
      change: "+3",
      trend: "up",
      icon: Package,
    },
    {
      label: t("pageViews"),
      value: "12,543",
      change: "-2.3%",
      trend: "down",
      icon: Eye,
    },
  ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
        return t("completed");
      case "shipped":
        return t("shipped");
      case "pending":
        return t("pending");
      case "processing":
        return t("processing");
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display text-2xl font-semibold">LUXE</span>
              <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">
                {t("adminLabel")}
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {sidebarLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Back to Store */}
          <div className="p-4 border-t border-border">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/">← {t("shop")}</Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="font-display text-xl font-semibold">
                {t("dashboard")}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Button variant="gold" size="sm">
                <Package className="h-4 w-4 mr-2" />
                {t("products")}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p
                      className={cn(
                        "text-xs flex items-center mt-1",
                        stat.trend === "up"
                          ? "text-success"
                          : "text-destructive"
                      )}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t("recentOrders")}</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin/orders">{t("viewAll")}</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between py-3 border-b border-border last:border-0"
                      >
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.id} • {order.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(order.total)}
                          </p>
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              order.status === "delivered" &&
                                "bg-success/20 text-success",
                              order.status === "shipped" &&
                                "bg-accent/20 text-accent",
                              order.status === "processing" &&
                                "bg-muted text-muted-foreground",
                              order.status === "pending" &&
                                "bg-destructive/20 text-destructive"
                            )}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t("topProducts")}</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin/products">{t("viewAll")}</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 4).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 py-3 border-b border-border last:border-0"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.stock} {t("inStock")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatPrice(product.price)}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <TrendingUp className="h-3 w-3" />
                            {product.reviewCount} {t("sales")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
