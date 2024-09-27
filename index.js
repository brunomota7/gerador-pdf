const express = require('express')
const bodyParser = require('body-parser')
const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')

// Rota para exibir o formulario
app.get('/formulario', (req, res) => {
    res.render('form')
})

// Rota para gerar o PDF
app.post('/gerar-pdf', (req, res) => {
    const {nome, email, mensagem} = req.body
    const doc = new PDFDocument()

    if (!fs.existsSync(path.join(__dirname, 'public'))) {
        fs.mkdirSync(path.join(__dirname, 'public'))
    }

    // Pasta para salvar o PDF
    const filePath = path.join(__dirname, 'public', `documento.pdf`)
    const stream = fs.createWriteStream(filePath)

    doc.pipe(stream)

    doc.fontSize(25).text('Dados do Formulário', {align: 'center'})
    doc.text(`
        Nome: ${nome}
        Email: ${email}
        Mensagem: ${mensagem}
    `)

    doc.end()

    // Faz download quando o arquivo estiver pronto
    stream.on('finish', () => {
        res.download(filePath)
    })
})

// Inicia o servidor
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})