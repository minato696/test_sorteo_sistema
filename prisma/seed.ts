import { PrismaClient, EstadoSorteo } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed...')

  // Limpiar datos existentes
  await prisma.ticket.deleteMany()
  await prisma.participante.deleteMany()
  await prisma.sorteo.deleteMany()

  // Crear sorteos de ejemplo
  const sorteos = await Promise.all([
    prisma.sorteo.create({
      data: {
        titulo: "iPhone 15 Pro Max",
        descripcion: "Participa por el último iPhone 15 Pro Max de 256GB. El smartphone más avanzado de Apple con cámara profesional y Dynamic Island.",
        imagenUrl: "/uploads/sorteos/iphone15.jpg",
        precio: new Decimal(20),
        fechaSorteo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde ahora
        ticketsDisponibles: 450,
        ticketsVendidos: 50,
        ticketsTotales: 500,
        estado: EstadoSorteo.ACTIVO,
        premio: "iPhone 15 Pro Max 256GB",
        valorPremio: new Decimal(5499),
        destacado: true,
        proximamente: false
      }
    }),
    prisma.sorteo.create({
      data: {
        titulo: "PlayStation 5 + 2 Juegos",
        descripcion: "Gana una PlayStation 5 con dos juegos a elección. La consola de última generación con gráficos 4K y experiencia de juego inmersiva.",
        imagenUrl: "/uploads/sorteos/ps5.jpg",
        precio: new Decimal(15),
        fechaSorteo: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días desde ahora
        ticketsDisponibles: 280,
        ticketsVendidos: 20,
        ticketsTotales: 300,
        estado: EstadoSorteo.ACTIVO,
        premio: "PlayStation 5 Standard + 2 Juegos",
        valorPremio: new Decimal(2999),
        destacado: false,
        proximamente: false
      }
    }),
    prisma.sorteo.create({
      data: {
        titulo: "MacBook Pro M3",
        descripcion: "El portátil más potente de Apple. MacBook Pro de 14 pulgadas con chip M3, 16GB de RAM y 512GB de almacenamiento.",
        imagenUrl: "/uploads/sorteos/macbook.jpg",
        precio: new Decimal(25),
        fechaSorteo: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 días desde ahora
        ticketsDisponibles: 400,
        ticketsVendidos: 0,
        ticketsTotales: 400,
        estado: EstadoSorteo.PROXIMO,
        premio: "MacBook Pro 14\" M3",
        valorPremio: new Decimal(7999),
        destacado: true,
        proximamente: true
      }
    })
  ])

  console.log(`${sorteos.length} sorteos creados`)

  // Crear un participante de prueba con tickets
  const participante = await prisma.participante.create({
    data: {
      dni: "12345678",
      nombres: "Juan Carlos",
      apellidos: "Pérez García",
      telefono: "987654321",
      email: "juan.perez@email.com",
      departamento: "Lima",
      cantidad: 3,
      montoTotal: new Decimal(60),
      estadoPago: "PAGADO",
      sorteoId: sorteos[0].id,
      tickets: {
        create: [
          {
            codigo: "TKT-001-0001",
            numeroTicket: 1,
            sorteoId: sorteos[0].id
          },
          {
            codigo: "TKT-001-0002",
            numeroTicket: 2,
            sorteoId: sorteos[0].id
          },
          {
            codigo: "TKT-001-0003",
            numeroTicket: 3,
            sorteoId: sorteos[0].id
          }
        ]
      }
    }
  })

  console.log('Participante de prueba creado con 3 tickets')
console.log('Seed completado exitosamente!')
}  // <-- Solo una llave aquí

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })