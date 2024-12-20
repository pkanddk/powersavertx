import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-auto py-6 px-4 border-t">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          © 2024 Power Saver TX  I  a pk and dk app
        </div>
        <nav className="flex items-center gap-6">
          <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            FAQ
          </Link>
          <a
            href="mailto:support@powersavertx.com"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}