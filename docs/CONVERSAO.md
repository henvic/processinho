Como os arquivos de leis e PLs não estão sempre em html, é necesśário que se faça a conversão.

Sugestão do que usar pra converter os vários formatos de entrada (a saída final deve ser sempre html, 
mantendo a formatação original)

| Formato original 	|     Características       | Modo de conversão                                                                                                                	|
|:-----------------:|:-------------------------:|----------------------------------------------------------------------------------------------------------------------------------	|
|*.doc      	    |Arquivo doc "simples" 	    | Abiword via command line.  Ex: abiword -t output.html input.doc                                                                  	|
|*.docx      	    |Arquivo OpenXML    	    | Uso da biblioteca (https://github.com/mwilliamson/python-mammoth)  via API ou command line.                                      	|
|*.pdf      	    |PDF "comum"      	        | Usando o pdf2htmlEX (https://github.com/coolwanglu/pdf2htmlEX). Ele preserva a formatação na saída, incluindo imagens e fontes.  	|
|*.pdf      	    |PDF com layer de texto     | O texto pode ser extraído usado a ferramenta pdftotext, do projeto poppler.                                                      	|
|*.pdf              |PDF só com imagens         | Talvez seja necessária a extração das páginas, exportando-as para imagens e depois um pré-processamento, para depois rodar um OCR. Existem soluções comerciais pra isso, como o SDK da Abby, mas a licença custa  *a partir* de 7 mil dólares e é meio burocrático para comprar. Uma outra solução, aberta, que não tem a mesma qualidade, mas que pode ser usada e adaptada pro nosso uso: https://github.com/GNOME/ocrfeeder/|    

A ideia é ter uma cópia do arquivo localmente e no banco a versão em html e em texto puro. 
