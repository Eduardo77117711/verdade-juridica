# Verdade Jurídica

Analisador de casos jurídicos em que **o modelo de linguagem propõe e o código julga**.

Você cola o texto de um caso. Um modelo devolve fatos, conclusões e normas. Antes de mostrar qualquer coisa, uma função determinística (`verificar`) confere cada item contra o texto original e rebaixa o que não se sustenta:

| O modelo diz | O código faz |
|---|---|
| Fato com trecho que não existe no caso | `NAO_LOCALIZADO` |
| Conclusão `PROVADO` sem apoio literal no caso | cai para `MOSTRADO` |
| Lei citada como se estivesse no caso, mas não está | `VERIFICAR` |
| Estado inventado (ex.: "CERTEZA_ABSOLUTA") | `MENCIONADO`, nunca `PROVADO` |
| Trecho curto demais (palavra solta) | não conta como prova |

Acento e maiúscula não rebaixam uma citação correta. Cada análise traz o log da auditoria do código.

## Estados

- **PROVADO** — há trecho literal no caso que sustenta.
- **MOSTRADO** — há indício, mas sem prova literal.
- **MENCIONADO** — dito, sem apoio.
- **NAO_LOCALIZADO / VERIFICAR** — o código não encontrou ou não pôde conferir.

## Verificar você mesmo

```bash
node verificador.test.js index.html
```

O teste extrai as funções reais do `index.html` publicado (não uma cópia) e ataca o juiz com 8 análises falsas. Resultado esperado: `ESTADO: PROVADO o juiz por codigo (8/8)`. O mesmo teste roda no GitHub Actions a cada envio.

## Onde roda

`index.html` é um único arquivo. A parte de análise usa o runtime de artefatos do Claude (`window.claude`); fora dele a página abre, mas não analisa. O juiz por código (`verificar`) é JavaScript puro e funciona em qualquer lugar.

## Limite

Não é aconselhamento jurídico. O código confere se o que foi dito **está no texto do caso**; não confere se a lei citada existe ou está em vigor — por isso ela vem marcada como `VERIFICAR`.

---
Parte do ecossistema [TPL](https://github.com/Eduardo77117711/-tpl-).

Criado por Carlos Eduardo Acevedo Rodrigues. Copyright 2026.
Licenciado sob a [Apache License 2.0](LICENSE): livre para usar, modificar e redistribuir, mantendo esta atribuição e o arquivo [NOTICE](NOTICE).
