"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Trophy, Users, Shield, ArrowRight } from 'lucide-react'

export default function HeroSection() {
  const [currentPrize, setCurrentPrize] = useState(0)
  
  const prizes = [
    {
      title: "iPhone 15 Pro Max",
      price: "S/ 20.00",
      image: "/images/premios/iphone15.jpg",
      tag: "MÁS POPULAR"
    },
    {
      title: "PlayStation 5",
      price: "S/ 15.00",
      image: "/images/premios/ps5.jpg",
      tag: "ÚLTIMOS TICKETS"
    },
    {
      title: "MacBook Pro M3",
      price: "S/ 25.00",
      image: "/images/premios/macbook.jpg",
      tag: "PRÓXIMAMENTE"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrize((prev) => (prev + 1) % prizes.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 text-white py-16 md:py-24 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Contenido del Hero */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="animate-pulse w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              <span className="text-sm font-medium">Sorteos en vivo cada semana</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Gana premios increíbles con solo un{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                ticket
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
              Sorteos 100% legales y transparentes. Transmitidos en vivo por nuestras redes sociales 
              para garantizar la legitimidad de cada ganador.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link 
                href="/sorteos" 
                className="group bg-white text-purple-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center"
              >
                Ver sorteos activos
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#como-funciona" 
                className="bg-white/10 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center justify-center"
              >
                ¿Cómo funciona?
              </Link>
            </div>
            
            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex justify-center mb-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold">50+</div>
                <div className="text-sm text-white/80">Premios entregados</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex justify-center mb-2">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold">12K+</div>
                <div className="text-sm text-white/80">Clientes felices</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex justify-center mb-2">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold">100%</div>
                <div className="text-sm text-white/80">Transparencia</div>
              </div>
            </div>
          </div>
          
          {/* Tarjeta de premio animada */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              {/* Efecto de brillo detrás */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl filter blur-2xl opacity-50 animate-pulse"></div>
              
              {/* Etiqueta de precio */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full h-24 w-24 flex items-center justify-center text-white font-bold transform rotate-12 shadow-2xl z-20 animate-bounce">
                <div className="text-center">
                  <div className="text-xs">DESDE</div>
                  <div className="text-2xl">{prizes[currentPrize].price}</div>
                </div>
              </div>
              
              {/* Tarjeta principal */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden p-6 w-80 md:w-96 transform hover:scale-105 transition-all duration-500">
                <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-6 relative overflow-hidden">
                  {prizes[currentPrize].image ? (
                    <Image 
                      src={prizes[currentPrize].image}
                      alt={prizes[currentPrize].title}
                      fill 
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Trophy className="w-20 h-20 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 font-medium">{prizes[currentPrize].title}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-gray-800 font-bold text-xl">{prizes[currentPrize].title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {prizes[currentPrize].price}
                    </span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {prizes[currentPrize].tag}
                    </span>
                  </div>
                  <Link 
                    href="/sorteos"
                    className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Participar Ahora
                  </Link>
                </div>
              </div>
              
              {/* Indicadores de carrusel */}
              <div className="flex justify-center mt-6 space-x-2">
                {prizes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPrize(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentPrize 
                        ? 'bg-white w-8' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
