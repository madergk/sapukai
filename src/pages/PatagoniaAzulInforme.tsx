import { useEffect } from 'react'
import {
  ArrowLeft,
  Gauge,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  Server,
  Check,
  Route,
  Lightbulb,
  ClipboardList,
  Heart,
  Lock,
  Shield,
  Zap,
  Bot,
  FileDown,
} from 'lucide-react'

interface PatagoniaAzulInformeProps {
  onNavigate?: (path: string) => void
}

export function PatagoniaAzulInforme({ onNavigate }: PatagoniaAzulInformeProps) {
  useEffect(() => {
    document.title = 'Informe de Migración | Patagonia Azul 2026'
    return () => {
      document.title = 'sapukai'
    }
  }, [])
  return (
    <div
      className="min-h-screen bg-white text-black antialiased"
      style={{ fontFamily: "'Geist Mono', monospace" }}
    >
      {/* Topbar */}
      <header className="sticky top-0 z-50 flex h-14 items-center border-b-2 border-black bg-white px-4 sm:px-6">
        <div className="flex w-full items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate?.('/')}
            className="-ml-2 flex min-h-10 min-w-10 touch-manipulation items-center justify-center rounded-none text-black transition-colors hover:bg-gray-100 active:bg-gray-200"
            aria-label="Volver al inicio"
          >
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-black font-bold text-white">
            PA
          </div>
          <div className="min-w-10" aria-hidden />
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">
        {/* Author / Meta Info Bar */}
        <div className="flex flex-col gap-3 border-l-4 border-l-black bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span className="text-xs font-bold uppercase tracking-wider">Responsable:</span>
            <span className="border-b border-black font-bold text-sm sm:text-base">
              MADERGK (Martin Gómez Kennedy)
            </span>
          </div>
          <div className="text-xs sm:text-sm">Versión 1.0 | Generado: 19/02/2026</div>
        </div>

        {/* 1. Executive Summary Cards */}
        <section>
          <h2 className="mb-3 flex items-center border-b border-black pb-2 text-base font-bold uppercase tracking-wide sm:mb-4 sm:text-xl">
            <Gauge className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Estado General
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Status Card */}
            <div className="border border-black bg-white p-4 shadow-none hover:bg-gray-50 sm:p-6">
              <div className="mb-2 border-b border-black pb-1 text-xs font-bold uppercase tracking-wider">
                Progreso
              </div>
              <div className="flex items-baseline">
                <span className="text-5xl font-black">95%</span>
              </div>
              <div className="mt-2 text-sm font-bold text-green-600">
                <CheckCircle className="mr-1 inline h-4 w-4" />
                In progress
              </div>
            </div>

            {/* Hosting Switch */}
            <div className="border border-black bg-white p-4 shadow-none hover:bg-gray-50 sm:p-6">
              <div className="mb-2 border-b border-black pb-1 text-xs font-bold uppercase tracking-wider">
                Infraestructura
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-400 line-through">Lantech</span>
                <ArrowRight className="h-4 w-4" />
                <span className="border border-black bg-black px-2 py-1 font-bold text-white">
                  Infomaniak
                </span>
              </div>
              <div className="mt-3 border-t border-dashed border-black pt-2 text-xs">
                CMS: WordPress • PHP 8.2
              </div>
            </div>

            {/* Duration */}
            <div className="border border-black bg-white p-4 shadow-none hover:bg-gray-50 sm:p-6">
              <div className="mb-2 border-b border-black pb-1 text-xs font-bold uppercase tracking-wider">
                Tiempo de Ejecución
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold">~48 Horas</span>
              </div>
              <div className="mt-2 text-xs">Inicio: 18 Feb • Fin: 20 Feb</div>
            </div>

            {/* Critical Pending */}
            <div className="relative overflow-hidden border-2 border-black bg-white p-4 shadow-none sm:p-6">
              <div className="absolute right-0 top-0 bg-black px-2 py-1 text-xs font-bold text-white">
                ATENCIÓN
              </div>
              <div className="mb-2 flex items-center border-b border-black pb-1 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Acción Requerida
              </div>
              <div className="mt-2">
                <span className="text-lg font-bold">Mixed Content</span>
              </div>
              <div className="mt-1 text-xs font-medium">URLs de imágenes en HTTP detectadas.</div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Left Column: Infrastructure & DNS */}
          <div className="space-y-6 lg:col-span-2 lg:space-y-8">
            {/* 2. Infrastructure Details */}
            <section className="overflow-hidden border border-black bg-white shadow-none">
              <div className="flex items-center justify-between border-b border-black bg-black px-4 py-3 text-white sm:px-6 sm:py-4">
                <h3 className="text-sm font-bold uppercase">Infraestructura Post-Migración</h3>
                <Server className="h-5 w-5" />
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 inline-block border-b border-black text-xs font-bold uppercase">
                      Direcciones IP
                    </h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between border border-black p-2 text-sm">
                        <span>IPv4</span>
                        <span className="font-bold">185.125.27.167</span>
                      </div>
                      <div className="flex items-center justify-between border border-black p-2 text-sm">
                        <span>IPv6</span>
                        <span className="text-xs font-bold">2001:1600:0:aaaa::80:56</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 inline-block border-b border-black text-xs font-bold uppercase">
                      Nameservers (Activos)
                    </h4>
                    <div className="border border-black bg-gray-50 p-3 text-sm">
                      <div className="mb-1">
                        <Check className="mr-2 inline h-4 w-4 text-green-600" />
                        ns11.infomaniak.ch
                      </div>
                      <div>
                        <Check className="mr-2 inline h-4 w-4 text-green-600" />
                        ns12.infomaniak.ch
                      </div>
                    </div>
                    <p className="mt-2 text-xs italic">
                      Registrador: DonWeb (Configurado en Infomaniak).
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. DNS & Redirects Analysis */}
            <section className="overflow-hidden border border-black bg-white shadow-none">
              <div className="flex items-center justify-between border-b border-black bg-black px-4 py-3 text-white sm:px-6 sm:py-4">
                <h3 className="text-sm font-bold uppercase">Auditoría de Redirecciones & SEO</h3>
                <Route className="h-5 w-5" />
              </div>
              <div className="overflow-x-auto p-0">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="border-b border-black bg-white text-xs font-bold uppercase text-black">
                    <tr>
                      <th className="border-r border-black px-3 py-2 sm:px-6 sm:py-3">Origen</th>
                      <th className="border-r border-black px-3 py-2 sm:px-6 sm:py-3">Destino</th>
                      <th className="border-r border-black px-3 py-2 sm:px-6 sm:py-3">Código</th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black">
                    <tr>
                      <td className="border-r border-black px-3 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm">
                        http://patagoniaazul.org
                      </td>
                      <td className="border-r border-black px-3 py-2 text-xs sm:px-6 sm:py-3 sm:text-sm">
                        https://patagoniaazul.org/
                      </td>
                      <td className="border-r border-black px-6 py-3">
                        <span className="border border-black px-2 py-0.5 text-xs font-bold">
                          301
                        </span>
                      </td>
                      <td className="px-6 py-3 font-bold text-green-600">
                        <Check className="mr-1 inline h-4 w-4" />
                        Correcto
                      </td>
                    </tr>
                    <tr>
                      <td className="border-r border-black px-6 py-3">
                        http://www.patagoniaazul.org
                      </td>
                      <td className="border-r border-black px-6 py-3">
                        https://patagoniaazul.org/
                      </td>
                      <td className="border-r border-black px-6 py-3">
                        <span className="border border-black px-2 py-0.5 text-xs font-bold">
                          301
                        </span>
                      </td>
                      <td className="px-6 py-3 font-bold text-green-600">
                        <Check className="mr-1 inline h-4 w-4" />
                        Correcto
                      </td>
                    </tr>
                    <tr>
                      <td className="border-r border-black px-6 py-3">
                        https://patagoniaazul.org/
                      </td>
                      <td className="border-r border-black px-6 py-3 text-gray-400">-</td>
                      <td className="border-r border-black px-6 py-3">
                        <span className="border border-black px-2 py-0.5 text-xs font-bold">
                          200
                        </span>
                      </td>
                      <td className="px-6 py-3 font-bold text-green-600">
                        <Check className="mr-1 inline h-4 w-4" />
                        OK
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex items-start gap-3 border-t border-black bg-white p-3 sm:p-4">
                <Lightbulb className="mt-1 h-5 w-5 shrink-0 text-black" />
                <div>
                  <h4 className="text-sm font-bold uppercase">Oportunidad de Mejora</h4>
                  <p className="mt-1 text-xs">
                    La latencia de redirección actual es de <strong>354.39 ms</strong>. Se
                    recomienda configurar la redirección a nivel de servidor (Apache/.htaccess) en
                    lugar de WordPress para reducir este tiempo a &lt;50ms.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Action Plan Table */}
            <section className="overflow-hidden border border-black bg-white shadow-none">
              <div className="flex items-center justify-between border-b border-black bg-black px-4 py-3 text-white sm:px-6 sm:py-4">
                <h3 className="text-sm font-bold uppercase">Resumen de Acciones & Hallazgos</h3>
                <ClipboardList className="h-5 w-5" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px] text-left text-sm">
                  <tbody className="divide-y divide-black">
                    <tr className="bg-white">
                      <td className="w-10 shrink-0 border-r border-black px-3 py-3 text-center text-green-600 sm:w-12 sm:px-6 sm:py-4">
                        <CheckCircle className="mx-auto h-4 w-4 sm:h-5 sm:w-5" />
                      </td>
                      <td className="border-r border-black px-3 py-3 sm:px-6 sm:py-4">
                        <div className="font-bold">Mixed Content (Imágenes en HTTP)</div>
                        <div className="text-xs">
                          URLs de imágenes en schema data usan http:// en lugar de https://
                        </div>
                      </td>
                      <td className="border-r border-black px-3 py-3 sm:px-6 sm:py-4">
                        <span className="border border-green-600 px-2 py-1 text-xs font-bold text-green-600">
                          RESUELTO
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs sm:px-6 sm:py-4">
                        Ejecutar plugin &apos;Better Search Replace&apos; en BD.
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="w-10 shrink-0 border-r border-black px-3 py-3 text-center text-green-600 sm:w-12 sm:px-6 sm:py-4">
                        <CheckCircle className="mx-auto h-4 w-4 sm:h-5 sm:w-5" />
                      </td>
                      <td className="border-r border-black px-3 py-3 sm:px-6 sm:py-4">
                        <div className="font-bold">Robots.txt Optimizado</div>
                        <div className="text-xs">
                          Referencia a Sitemap añadida y Crawl-delay eliminado.
                        </div>
                      </td>
                      <td className="border-r border-black px-3 py-3 sm:px-6 sm:py-4">
                        <span className="border border-green-600 px-2 py-1 text-xs font-bold text-green-600">
                          RESUELTO
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs sm:px-6 sm:py-4">
                        Actualizado el 19 de febrero.
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="w-10 shrink-0 border-r border-black px-3 py-3 text-center text-green-600 sm:w-12 sm:px-6 sm:py-4">
                        <CheckCircle className="mx-auto h-4 w-4 sm:h-5 sm:w-5" />
                      </td>
                      <td className="border-r border-black px-3 py-3 sm:px-6 sm:py-4">
                        <div className="font-bold">Sitemaps XML</div>
                        <div className="text-xs">sitemap_index.xml verificado y accesible.</div>
                      </td>
                      <td className="border-r border-black px-3 py-3 sm:px-6 sm:py-4">
                        <span className="border border-green-600 px-2 py-1 text-xs font-bold text-green-600">
                          RESUELTO
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs sm:px-6 sm:py-4">Validado en Infomaniak.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Column: Checklist & Health */}
          <div className="space-y-6 lg:space-y-8">
            {/* Technical Checklist Widget */}
            <section className="overflow-hidden border border-black bg-white shadow-none">
              <div className="flex items-center justify-between border-b border-black bg-black px-4 py-3 text-white sm:px-6 sm:py-4">
                <h3 className="text-sm font-bold uppercase">Health Check</h3>
                <Heart className="h-5 w-5" />
              </div>
              <div className="space-y-4 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center border border-green-600 text-green-600">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Certificado SSL</div>
                      <div className="text-xs">Activo (Infomaniak)</div>
                    </div>
                  </div>
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center border border-green-600 text-green-600">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">HSTS</div>
                      <div className="text-xs">max-age=16000000</div>
                    </div>
                  </div>
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center border border-green-600 text-green-600">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Protocolo HTTP/2</div>
                      <div className="text-xs">Habilitado</div>
                    </div>
                  </div>
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center border border-green-600 text-green-600">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Robots.txt</div>
                      <div className="text-xs">Accesible & Correcto</div>
                    </div>
                  </div>
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </section>

            {/* Sitemap Status */}
            <section className="border border-black bg-white p-4 shadow-none sm:p-6">
              <h3 className="mb-4 border-b border-black pb-2 text-sm font-bold uppercase tracking-wide">
                Estado de Sitemaps
              </h3>
              <div className="space-y-3">
                <a
                  href="https://patagoniaazul.org/sitemap_index.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between border border-black p-3 transition-colors hover:bg-gray-100"
                >
                  <span className="text-sm group-hover:underline">/sitemap_index.xml</span>
                  <span className="border border-green-600 px-2 py-1 text-xs font-bold text-green-600">
                    200 OK
                  </span>
                </a>
                <a
                  href="https://patagoniaazul.org/post-sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between border border-black p-3 transition-colors hover:bg-gray-100"
                >
                  <span className="text-sm group-hover:underline">/post-sitemap.xml</span>
                  <span className="border border-green-600 px-2 py-1 text-xs font-bold text-green-600">
                    200 OK
                  </span>
                </a>
                <a
                  href="https://patagoniaazul.org/page-sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between border border-black p-3 transition-colors hover:bg-gray-100"
                >
                  <span className="text-sm group-hover:underline">/page-sitemap.xml</span>
                  <span className="border border-green-600 px-2 py-1 text-xs font-bold text-green-600">
                    200 OK
                  </span>
                </a>
              </div>
            </section>

            {/* Downloads / Actions */}
            <section>
              <a
                href="https://drive.google.com/file/d/19jMnD7iRznwteuZGMtoPBO3yhtwt0yea/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full min-h-12 touch-manipulation items-center justify-center gap-2 border border-black bg-black py-3 font-bold text-white shadow-none transition-colors hover:bg-white hover:text-black active:bg-gray-100"
              >
                <FileDown className="h-5 w-5" />
                Descargar Informe PDF
              </a>
              <p className="mt-2 text-center text-xs italic">
                Documento original: Informe_Rewilding_PatagoniaAzul_2026.pdf
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-black bg-white py-6 sm:mt-12 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="font-bold">MADERGK</p>
          <p className="mt-1 text-sm">Martin Gómez Kennedy | +54 379 470 13 63</p>
          <p className="text-sm">
            <a href="mailto:martin.gomezkennedy@gmail.com" className="hover:underline">
              martin.gomezkennedy@gmail.com
            </a>
          </p>
          <p className="mt-4 text-xs">© 2026 Patagonia Azul. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
