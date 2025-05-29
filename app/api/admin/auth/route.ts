import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "admin123", 10);

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    const isValid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }
    
    // Crear cookie de sesión
    (await cookies()).set("admin-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 horas
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  (await cookies()).delete("admin-auth");
  return NextResponse.json({ success: true });
}
