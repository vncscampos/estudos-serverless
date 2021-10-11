# Meus estudo sobre serverless

## O que é serverless
A arquitetura _serverless_ (computação sem servidores) é uma arquitetura baseada em eventos, que permite que um servidor hospede um serviço sem a necessidade de configurar o servidor do zero pois todas as dependências necessárias para aquela função rodar já estão instaladas.

Geralmente essas funções são assíncronas sem a necessidade de execução imediata e são "disparadas" ou por rotas HTTP ou por um outro serviço.

## Vantagens
* Redução de custo;
* Auto-escalável;
* Flexibilidade;

## Desvantagens
* Quanto maior o tempo de execução de uma função, maior será o __custo__;
* O _debugging_ e testes desses serviços são díficeis;
