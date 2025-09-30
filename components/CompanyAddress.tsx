"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Globe, Phone, Mail } from 'lucide-react';

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
            {company.telefones && company.telefones.length > 0 && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-mono">
                  ({company.telefones[0].ddd}) {company.telefones[0].numero}
                </span>
              </div>
            )}
            {company.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm break-all">{company.email}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}