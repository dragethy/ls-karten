"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tractor, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600">
                <Mail className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-green-900 mb-2">E-Mail bestaetigen</h2>
            <p className="text-gray-500 mb-6">
              Wir haben dir eine Bestaetigungs-E-Mail gesendet. Klicke auf den Link, um dein Konto zu aktivieren.
            </p>
            <Button variant="outline" onClick={() => router.push("/auth/login")}>
              Zur Anmeldung
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600">
              <Tractor className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Konto erstellen</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Registriere dich kostenlos
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Benutzername</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="DeinName"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">E-Mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="deine@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Passwort</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Min. 6 Zeichen"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Wird registriert..." : "Registrieren"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Bereits ein Konto?{" "}
            <Link href="/auth/login" className="text-green-600 hover:underline font-medium">
              Anmelden
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
