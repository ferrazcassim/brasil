var boleto = require('../../../lib/boletoUtils.js'),
	Itau = require('../../../lib/boleto/bancos/itau.js'),
	geradorDeLinhaDigitavel = require('../../../lib/boleto/geradorDeLinhaDigitavel.js'),

	Datas = boleto.Datas,
	Beneficiario = boleto.Beneficiario,
	Pagador = boleto.Pagador,
	Boleto = boleto.Boleto,

	banco,
	boleto,
	beneficiario;

module.exports = {
	setUp: function(done) {
		var datas = Datas.novasDatas();
		datas.comDocumento(20, 3, 2013);
		datas.comProcessamento(20, 3, 2013);
		datas.comVencimento(1, 4, 2013);

		pagador = Pagador.novoPagador();
		pagador.comNome('Paulo Silveira');

		beneficiario = Beneficiario.novoBeneficiario();
		beneficiario.comNome('Rodrigo Turini');
		beneficiario.comAgencia('167');
		beneficiario.comCarteira('157');
		beneficiario.comCodigo('45145');
		beneficiario.comNossoNumero('21897666');
		beneficiario.comDigitoNossoNumero('6');

		banco = new Itau();

		boleto = Boleto.novoBoleto();
		boleto.comDatas(datas);
		boleto.comBeneficiario(beneficiario);
		boleto.comBanco(banco);
		boleto.comPagador(pagador);
		boleto.comValorBoleto(2680.16);
		boleto.comNumeroDoDocumento(575);

		done();
	},

	'Nosso número formatado deve ter oito digitos': function(test) {
		var beneficiario = Beneficiario.novoBeneficiario().comNossoNumero('9000206'),
			numeroFormatado = banco.getNossoNumeroFormatado(beneficiario);

		test.equals(8, numeroFormatado.length);
		test.equals('09000206', numeroFormatado);
		test.done();
	},

	'Carteira formatado deve ter três dígitos': function(test) {
		var beneficiario = Beneficiario.novoBeneficiario().comCarteira('1'),
			numeroFormatado = banco.getCarteiraFormatado(beneficiario);

		test.equals(3, numeroFormatado.length);
		test.equals('001', numeroFormatado);
		test.done();
	},

	'Conta corrente formatada deve ter cinco dígitos': function(test) {
		var numeroFormatado = banco.getCodigoFormatado(beneficiario);

		test.equals(5, numeroFormatado.length);
		test.equals('45145', numeroFormatado);
		test.done();
	},

	'Verifica geração da linha digitável - 1': function(test) {
		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
			linhaEsperada = "34191.57213 89766.660164 74514.590004 6 56550000268016";

		test.equal(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
		test.done();
	},

	'Verifica geração da linha digitável - 2': function(test) {
		datas = Datas.novasDatas();
		datas.comDocumento(20, 03, 2014);
		datas.comProcessamento(20, 03, 2014);
		datas.comVencimento(10, 04, 2014);

		beneficiario = Beneficiario.novoBeneficiario();
		beneficiario.comNome('Mario Amaral');
		beneficiario.comAgencia('8462');
		beneficiario.comCarteira('174');
		beneficiario.comCodigo('05825');
		beneficiario.comNossoNumero('00015135')
		beneficiario.comDigitoNossoNumero('6');

		pagador = Pagador.novoPagador();
		pagador.comNome('Rodrigo de Sousa');

	    boleto = Boleto.novoBoleto();
	    boleto.comDatas(datas);
	    boleto.comBeneficiario(beneficiario);
	    boleto.comBanco(banco);
	    boleto.comPagador(pagador);
	    boleto.comValorBoleto(2680.16);
	    boleto.comNumeroDoDocumento('575');
		boleto.comBanco(banco);

		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
			linhaEsperada = '34191.74002 01513.568467 20582.590004 6 60290000268016';

		test.equal(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
		test.done();
	},

	'Verifica geração da linha digitável - 3': function(test) {
		datas = Datas.novasDatas();
		datas.comDocumento(21, 5, 2014);
		datas.comProcessamento(21, 5, 2014);
		datas.comVencimento(21, 5, 2014);

		beneficiario = Beneficiario.novoBeneficiario();
		beneficiario.comCarteira('181');
		beneficiario.comAgencia('654');
		beneficiario.comContaCorrente('8711'); //Não se deve indicar o dígito da agencia
		beneficiario.comNossoNumero('94588021')
		beneficiario.comDigitoNossoNumero('4');

		pagador = Pagador.novoPagador();

	    boleto = Boleto.novoBoleto();
	    boleto.comEspecieDocumento('DSI');
	    boleto.comDatas(datas);
	    boleto.comBeneficiario(beneficiario);
	    boleto.comBanco(banco);
	    boleto.comPagador(pagador);
	    boleto.comValorBoleto(575);
	    boleto.comNumeroDoDocumento('1');
		boleto.comBanco(banco);

		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
			linhaEsperada = '34191.81940 58802.140655 40871.130007 4 60700000057500',
			linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

		test.equal(linhaEsperada, linhaGerada);
		test.done();
	},

	'Verifica geração da linha digitável - 4': function(test) {
		datas = Datas.novasDatas();
		datas.comDocumento(29, 5, 2014);
		datas.comProcessamento(29, 5, 2014);
		datas.comVencimento(23, 6, 2014);

		beneficiario = Beneficiario.novoBeneficiario();
		beneficiario.comCarteira('157');
		beneficiario.comAgencia('654');
		beneficiario.comContaCorrente('8711'); //Não se deve indicar o dígito da agencia
		beneficiario.comNossoNumero('89605074')
		beneficiario.comDigitoNossoNumero('2');

		pagador = Pagador.novoPagador();

	    boleto = Boleto.novoBoleto();
	    boleto.comEspecieDocumento('DSI');
	    boleto.comDatas(datas);
	    boleto.comBeneficiario(beneficiario);
	    boleto.comBanco(banco);
	    boleto.comPagador(pagador);
	    boleto.comValorBoleto(115.38);
	    boleto.comNumeroDoDocumento('2');
		boleto.comBanco(banco);

		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
			linhaEsperada = '34191.57890 60507.420655 40871.130007 1 61030000011538',
			linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

		test.equal(linhaEsperada, linhaGerada);
		test.done();
	},

	'Verifica geração da linha digitável - 5': function(test) {
		datas = Datas.novasDatas();
		datas.comDocumento(20, 8, 2014);
		datas.comProcessamento(20, 8, 2014);
		datas.comVencimento(27, 8, 2014);

		beneficiario = Beneficiario.novoBeneficiario();
		beneficiario.comCarteira('157');
		beneficiario.comAgencia('654');
		beneficiario.comContaCorrente('8711'); //Não se deve indicar o dígito da agencia
		beneficiario.comNossoNumero('02891620')
		beneficiario.comDigitoNossoNumero('8');

		pagador = Pagador.novoPagador();

	    boleto = Boleto.novoBoleto();
	    boleto.comEspecieDocumento('DSI');
	    boleto.comDatas(datas);
	    boleto.comBeneficiario(beneficiario);
	    boleto.comBanco(banco);
	    boleto.comPagador(pagador);
	    boleto.comValorBoleto(115.38);
	    boleto.comNumeroDoDocumento('4');
		boleto.comBanco(banco);

		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
			linhaEsperada = '34191.57023 89162.080652 40871.130007 4 61680000011538',
			linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

		test.equal(linhaEsperada, linhaGerada);
		test.done();
	},

	'Verifica geração da linha digitável - 6': function(test) {
		datas = Datas.novasDatas();
		datas.comDocumento(19, 9, 2014);
		datas.comProcessamento(19, 9, 2014);
		datas.comVencimento(26, 9, 2014);

		beneficiario = Beneficiario.novoBeneficiario();
		beneficiario.comCarteira('157');
		beneficiario.comAgencia('654');
		beneficiario.comContaCorrente('8711'); //Não se deve indicar o dígito da agencia
		beneficiario.comNossoNumero('07967777')
		beneficiario.comDigitoNossoNumero('4');

		pagador = Pagador.novoPagador();

	    boleto = Boleto.novoBoleto();
	    boleto.comEspecieDocumento('FS');
	    boleto.comDatas(datas);
	    boleto.comBeneficiario(beneficiario);
	    boleto.comBanco(banco);
	    boleto.comPagador(pagador);
	    boleto.comValorBoleto(230.76);
	    boleto.comNumeroDoDocumento('5');
		boleto.comBanco(banco);

		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
			linhaEsperada = '34191.57072 96777.740653 40871.130007 9 61980000023076',
			linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

		test.equal(linhaEsperada, linhaGerada);
		test.done();
	},

	'Verifica geração do código de barras': function(test) {
		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);

		test.equal('34196565500002680161572189766660167451459000', codigoDeBarras);
		test.done();
	},
}