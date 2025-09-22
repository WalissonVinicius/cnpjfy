'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from "next/image";
import {
  Github,
  Globe,
  Heart,
  Code,
  Database,
  Shield,
  Zap,
  Users,
  ExternalLink,
  Mail,
  Star,
  Check
} from 'lucide-react'
import Link from 'next/link'

interface AboutPageProps {
  params: { locale: string }
}

export default function AboutPage({ params }: AboutPageProps) {
  const [isEmailCopied, setIsEmailCopied] = useState(false)

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('walissonvinicius10654@gmail.com')
      setIsEmailCopied(true)
      setTimeout(() => setIsEmailCopied(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar email:', error)
    }
  }
  const features = [
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Dados Atualizados',
      description: 'Informações sempre atualizadas diretamente da Receita Federal'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Consulta Rápida',
      description: 'Resultados instantâneos com interface otimizada'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Totalmente Gratuito',
      description: 'Sem limites, sem cadastro, sem custos ocultos'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Open Source',
      description: 'Código aberto e transparente para toda a comunidade'
    }
  ]

  const technologies = [
    { name: 'Next.js 14', description: 'Framework React moderno' },
    { name: 'TypeScript', description: 'Tipagem estática' },
    { name: 'TailwindCSS', description: 'Estilização utilitária' },
    { name: 'shadcn/ui', description: 'Componentes acessíveis' },
    { name: 'React Query', description: 'Gerenciamento de estado' },
    { name: 'IndexedDB', description: 'Cache offline' }
  ]

  const contributors = [
    {
      name: "Walisson",
      role: "Criador do CNPJfy",
      description: "Desenvolvedor do frontend",
      github: "https://github.com/WalissonVinicius",
      image: "/wv.jpg" // está no public
    },
    {
      name: "Hitmasu",
      role: "Desenvolvedor da OpenCNPJ",
      description: "Desenvolvedor principal da API e datasets",
      github: "https://github.com/Hitmasu",
      image: "/himatsu.jpeg" // está no public
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-brand-600 via-purple-600 to-accent-500 bg-clip-text text-transparent">
            Sobre o CNPJfy
          </h1>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Uma plataforma gratuita e open source para consulta de dados empresariais brasileiros
          </p>
          <div className="flex justify-center gap-6">
            <Button
              asChild
              className="bg-gradient-to-r from-brand-600 to-accent-500 hover:from-brand-700 hover:to-accent-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link href="https://github.com/WalissonVinicius/cnpjfy" target="_blank">
                <Github className="h-5 w-5 mr-2" />
                Ver no GitHub
                <ExternalLink className="h-5 w-5 ml-2" />
              </Link>
            </Button>

          </div>
        </div>

        {/* Mission */}
        <Card className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500">
                <Heart className="h-6 w-6 text-white" />
              </div>
              Nossa Missão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-lg leading-relaxed">
              Democratizar o acesso às informações empresariais brasileiras, fornecendo uma
              plataforma gratuita, rápida e confiável para consulta de dados de CNPJ.
            </p>
            <p className="text-lg leading-relaxed">
              Acreditamos que informações públicas devem ser acessíveis a todos, sem barreiras
              financeiras ou técnicas. Por isso, mantemos o CNPJfy como um projeto 100%
              gratuito e open source.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Principais Recursos
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/80 dark:to-gray-800/60 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-6 text-center relative z-10">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-6 w-6" />
              Tecnologias Utilizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {technologies.map((tech, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="p-2 rounded bg-primary/10">
                    <Code className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">{tech.name}</h4>
                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Source */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Fonte dos Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Todos os dados são obtidos diretamente dos arquivos públicos disponibilizados
              pela <strong>Receita Federal do Brasil</strong>, garantindo autenticidade e
              atualização constante das informações.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Receita Federal</Badge>
              <Badge variant="secondary">Dados Públicos</Badge>
              <Badge variant="secondary">Atualizações Mensais</Badge>
              <Badge variant="secondary">100% Oficial</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Contributors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Contribuidores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {contributors.map((contributor, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg border"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={contributor.image}
                      alt={contributor.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>

                  {/* Informações */}
                  <div className="flex-1">
                    <h4 className="font-semibold">{contributor.name}</h4>
                    <p className="text-sm text-primary">{contributor.role}</p>
                    <p className="text-sm text-muted-foreground">
                      {contributor.description}
                    </p>
                  </div>

                  {/* GitHub */}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={contributor.github} target="_blank">
                      <Github className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas do Projeto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">50M+</div>
                <div className="text-sm text-muted-foreground">Empresas no Banco</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-sm text-muted-foreground">Gratuito</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-muted-foreground">Disponibilidade</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">Open</div>
                <div className="text-sm text-muted-foreground">Source</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6" />
              Apoie o Projeto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              O CNPJfy é mantido por voluntários e depende da comunidade para continuar
              funcionando. Você pode ajudar de várias formas:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">Para Desenvolvedores</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Contribua com código no GitHub</li>
                  <li>• Reporte bugs e sugestões</li>
                  <li>• Melhore a documentação</li>
                  <li>• Compartilhe o projeto</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Para Usuários</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Dê uma estrela no GitHub</li>
                  <li>• Compartilhe com outros</li>
                  <li>• Reporte problemas</li>
                  <li>• Sugira melhorias</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button asChild>
                <Link href="https://github.com/WalissonVinicius/cnpjfy" target="_blank">
                  <Star className="h-4 w-4 mr-2" />
                  Dar Estrela no GitHub
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleCopyEmail}
              >
                {isEmailCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Copiado para área de transferência
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Entrar em Contato
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* License */}
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Este projeto é licenciado sob a{' '}
              <Link
                href="https://github.com/WalissonVinicius/cnpjfy/blob/main/LICENSE"
                target="_blank"
                className="text-primary hover:underline"
              >
                Licença MIT
              </Link>
              {' '}• Feito com ❤️ para a comunidade brasileira
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}