"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Globe, Phone, Mail, MessageCircle, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CompanyAddressProps {
  company: {
    endereco?: {
      logradouro?: string;
      numero?: string;
      complemento?: string;
      bairro?: string;
      municipio?: string;
      uf?: string;
      cep?: string;
    };
    situacao_cadastral?: string;
    data_situacao_cadastral?: string;
    email?: string;
    telefones?: Array<{ ddd: string; numero: string; isFax?: boolean }>;
  };
}

export function CompanyAddress({ company }: CompanyAddressProps) {
  const { endereco } = company;
  const { toast } = useToast();
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!endereco) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Endereço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Informações de endereço não disponíveis</p>
        </CardContent>
      </Card>
    );
  }

  const formatAddress = () => {
    const parts = [];

    if (endereco.logradouro) parts.push(endereco.logradouro);
    if (endereco.numero) parts.push(endereco.numero);
    if (endereco.complemento) parts.push(endereco.complemento);

    return parts.join(', ');
  };

  const formatLocation = () => {
    const parts = [];

    if (endereco.bairro) parts.push(endereco.bairro);
    if (endereco.municipio) parts.push(endereco.municipio);
    if (endereco.uf) parts.push(endereco.uf);

    return parts.join(' - ');
  };

  const formatCEP = (cep?: string) => {
    if (!cep) return '-';
    const cleanCEP = cep.replace(/\D/g, '');
    if (cleanCEP.length !== 8) return cep;
    return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const getSituacaoColor = (situacao?: string) => {
    if (!situacao) return 'secondary';

    const situacaoLower = situacao.toLowerCase();
    if (situacaoLower.includes('ativa')) return 'default';
    if (situacaoLower.includes('suspensa')) return 'destructive';
    if (situacaoLower.includes('baixada')) return 'secondary';
    return 'secondary';
  };

  // Gera a URL do Google Maps com o endereço completo
  const getGoogleMapsEmbedUrl = () => {
    const addressParts = [];

    if (endereco.logradouro) addressParts.push(endereco.logradouro);
    if (endereco.numero) addressParts.push(endereco.numero);
    if (endereco.bairro) addressParts.push(endereco.bairro);
    if (endereco.municipio) addressParts.push(endereco.municipio);
    if (endereco.uf) addressParts.push(endereco.uf);
    if (endereco.cep) addressParts.push(endereco.cep);

    const fullAddress = addressParts.join(', ');
    const encodedAddress = encodeURIComponent(fullAddress);

    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}&zoom=16`;
  };

  // Verifica se o telefone é celular (9 dígitos após o DDD começando com 9)
  const isCelular = (numero: string) => {
    const cleanNumber = numero.replace(/\D/g, '');
    // Celular tem 9 dígitos e começa com 9 (ex: 91234-5678)
    // ou tem 8 dígitos e começa com 9 (formato antigo, ex: 9234-5678)
    if (cleanNumber.length === 9 && cleanNumber.startsWith('9')) {
      return true;
    }
    if (cleanNumber.length === 8 && cleanNumber.startsWith('9')) {
      return true;
    }
    return false;
  };

  // Gera link do WhatsApp
  const getWhatsAppLink = (ddd: string, numero: string) => {
    const cleanDDD = ddd.replace(/\D/g, '');
    const cleanNumber = numero.replace(/\D/g, '');

    // Se o número tem 8 dígitos e começa com 9, adiciona o 9 extra
    const finalNumber = cleanNumber.length === 8 && cleanNumber.startsWith('9')
      ? '9' + cleanNumber
      : cleanNumber;

    return `https://wa.me/55${cleanDDD}${finalNumber}`;
  };

  // Copia email para área de transferência
  const copyEmailToClipboard = async () => {
    if (!company.email) return;

    try {
      await navigator.clipboard.writeText(company.email);
      setCopiedEmail(true);
      toast({
        title: '✓ Email copiado!',
        description: 'O email foi copiado para a área de transferência.',
      });

      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (error) {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o email.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Endereço
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações do Endereço */}
        <div className="grid gap-3">
          <div className="flex items-start gap-2">
            <Building2 className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="font-medium">{formatAddress() || 'Não informado'}</p>
              <p className="text-sm text-muted-foreground">{formatLocation()}</p>
              <p className="text-sm text-muted-foreground">
                CEP: {formatCEP(endereco.cep)}
              </p>
            </div>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="w-full h-64 rounded-lg overflow-hidden border border-border">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
            src={getGoogleMapsEmbedUrl()}
            allowFullScreen
            loading="lazy"
            title="Localização da empresa no Google Maps"
          />
        </div>

        {/* Contato */}
        {(company.telefones?.length || company.email) && (
          <div className="pt-4 border-t space-y-3">
            {/* Telefones */}
            {company.telefones && company.telefones.length > 0 && (
              <div className="space-y-2">
                {company.telefones.map((tel, index) => {
                  const celular = isCelular(tel.numero);
                  const phoneNumber = `(${tel.ddd}) ${tel.numero}`;
                  const whatsappLink = getWhatsAppLink(tel.ddd, tel.numero);

                  // Debug logs
                  console.log('Telefone:', { ddd: tel.ddd, numero: tel.numero, celular, whatsappLink });

                  if (celular) {
                    return (
                      <a
                        key={index}
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-mono text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors group"
                      >
                        <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span className="group-hover:underline">{phoneNumber}</span>
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                          WhatsApp
                        </span>
                      </a>
                    );
                  }

                  return (
                    <div key={index} className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{phoneNumber}</span>
                      {tel.isFax && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                          Fax
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Email */}
            {company.email && (
              <button
                onClick={copyEmailToClipboard}
                className="flex items-center gap-2 text-sm break-all text-left hover:text-brand-600 dark:hover:text-brand-400 transition-colors group w-full"
              >
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="group-hover:underline flex-1">{company.email}</span>
                {copiedEmail ? (
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 flex-shrink-0" />
                )}
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}