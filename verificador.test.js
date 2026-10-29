// Teste do juiz por código do Verdade Jurídica: extrai as funções reais do arquivo publicado e ataca com análises falsas.
const fs=require('fs'), crypto=require('crypto');
const src=fs.readFileSync(process.argv[2],'utf8');
const pin=crypto.createHash('sha256').update(src).digest('hex');
const js=src.slice(src.indexOf('<script>')+8, src.indexOf('</script>'));
const pega=(nome)=>{const i=js.indexOf('function '+nome+'('); let d=0,j=js.indexOf('{',i); for(let k=j;k<js.length;k++){if(js[k]=='{')d++; if(js[k]=='}'){d--; if(!d) return js.slice(i,k+1);}}};
const BLOCO_ESTADOS=js.slice(js.indexOf('var ESTADOS'), js.indexOf('};', js.indexOf('var ESTADOS'))+2);
eval(pega('norm')+pega('inText')+pega('arr')+BLOCO_ESTADOS+pega('verificar')+';globalThis.verificar=verificar;');
const CASO=js.match(/var EXEMPLO = "([\s\S]*?)";\n/)[1].replace(/\\n/g,'\n');
let falhas=0; const ok=(c,m)=>{console.log((c?'OK    ':'FALHA ')+m); if(!c) falhas++;};
// 1. análise honesta: trechos literais -> nada rebaixado
let v=verificar({fatos_documentados:[{fato:'aluguel pago',trecho:'comprovantes de transferência de abril a novembro de 2024, todos pagos até o dia 5'}],conclusoes:[{afirmacao:'pagou em dia',estado:'PROVADO',apoio:'todos pagos até o dia 5'}],normas:[]},CASO);
ok(v.rebaixados===0 && v.fatos[0].estado==='PROVADO' && v.conclusoes[0].estado==='PROVADO','analise honesta passa intacta');
// 2. mutante: fato inventado (prova que nao existe)
v=verificar({fatos_documentados:[{fato:'recibo de dezembro',trecho:'Marina juntou o recibo de dezembro de 2024'}]},CASO);
ok(v.fatos[0].estado==='NAO_LOCALIZADO','fato inventado e rebaixado');
// 3. mutante: conclusao PROVADO sem apoio literal
v=verificar({conclusoes:[{afirmacao:'Roberto pode despejar',estado:'PROVADO',apoio:'Marina confessou o atraso'}]},CASO);
ok(v.conclusoes[0].estado==='MOSTRADO','PROVADO sem apoio cai para MOSTRADO');
// 4. mutante: lei inventada dita como do caso
v=verificar({normas:[{referencia:'Art. 999 da Lei 1.234',origem:'NO_TEXTO'}]},CASO);
ok(v.normas[0].estado==='VERIFICAR','norma inventada marcada para conferir');
// 5. mutante: trecho curto demais (palavra solta "Marina") nao conta como prova
v=verificar({fatos_documentados:[{fato:'x',trecho:'Marina'}]},CASO);
ok(v.fatos[0].estado==='NAO_LOCALIZADO','trecho curto demais nao prova');
// 6. mutante: estado desconhecido vira MENCIONADO, nunca PROVADO
v=verificar({conclusoes:[{afirmacao:'x',estado:'CERTEZA_ABSOLUTA',apoio:''}]},CASO);
ok(v.conclusoes[0].estado==='MENCIONADO','estado inventado vira MENCIONADO');
// 7. resposta vazia ou quebrada nao derruba o juiz
v=verificar({},CASO); ok(v.conferidos===0,'resposta vazia tratada sem erro');
// 8. diferenca so de acento/maiuscula nao rebaixa citacao correta
v=verificar({fatos_documentados:[{fato:'y',trecho:'COMPROVANTES DE TRANSFERENCIA DE ABRIL A NOVEMBRO'}]},CASO);
ok(v.fatos[0].estado==='PROVADO','acento e maiuscula nao rebaixam citacao correta');
console.log('\npin do app: '+pin);
console.log(falhas? 'ESTADO: DIVERGENTE ('+falhas+' falha(s))' : 'ESTADO: PROVADO o juiz por codigo (8/8); AUTOMEDICAO ate reproducao independente');
process.exit(falhas?1:0);
