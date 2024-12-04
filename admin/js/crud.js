
let url = 'https://79ae8708-0b9d-4934-a377-e0443adfdcb9-00-87ym591ctbhd.picard.replit.dev/';

// Recebe do HTML o botão de salvar um novo livro
const botaoSalvar = document.getElementById('salvar');
let isEditing = false; // Variável para controlar se está no modo de edição
let livroOriginal = null; // Armazena o título original do livro sendo editado

// Função para criar um novo livro para o banco de dados
const postLivro = async function () {
  let titulo = document.getElementById('title');
  let descricao = document.getElementById('subtitle');
  let foto = document.getElementById('image');
  let valor = document.getElementById('price');

  let livroJSON = {
    title: titulo.value,
    subtitle: descricao.value,
    image: foto.value,
    price: parseFloat(valor.value),
  };

  try {
    let response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(livroJSON),
    });

    if (response.status === 201) {
      alert('Item inserido com sucesso');
      limparFormulario();
      getLivros();
    } else {
      alert('Não foi possível inserir o registro, verifique os dados enviados');
    }
  } catch (error) {
    console.error('Erro ao cadastrar livro:', error);
  }
};

// Função para excluir um livro
const deleteLivro = async function (title) {
  try {
    let response = await fetch(`${url}${encodeURIComponent(title)}`, {
      method: 'DELETE',
    });

    if (response.status === 200) {
      alert('Registro excluído com sucesso!');
      getLivros();
    } else {
      alert('Não foi possível realizar a exclusão do registro.');
    }
  } catch (error) {
    console.error('Erro ao excluir livro:', error);
  }
};

// Função para editar um livro
const editLivro = async function (originalTitle) {
  let titulo = document.getElementById('title');
  let descricao = document.getElementById('subtitle');
  let foto = document.getElementById('image');
  let valor = document.getElementById('price');

  let livroJSON = {
    title: titulo.value,
    subtitle: descricao.value,
    image: foto.value,
    price: parseFloat(valor.value),
  };

  try {
    let response = await fetch(`${url}${encodeURIComponent(originalTitle)}`, {
      method: 'PUT',
      mode: 'cors',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(livroJSON),
    });

    if (response.status === 200) {
      alert('Item editado com sucesso');
      limparFormulario();
      isEditing = false; // Desativa o modo de edição
      livroOriginal = null; // Limpa o título original
      botaoSalvar.innerText = 'Salvar'; // Restaura o texto do botão
      getLivros(); // Atualiza a lista
    } else {
      alert('Não foi possível editar o registro, verifique os dados enviados');
    }
  } catch (error) {
    console.error('Erro ao editar livro:', error);
  }
};

// Função para limpar o formulário
const limparFormulario = function () {
  document.getElementById('title').value = '';
  document.getElementById('subtitle').value = '';
  document.getElementById('image').value = '';
  document.getElementById('price').value = '';
};

// Função para listar todos os livros
const getLivros = async function () {
  console.log('Iniciando a busca dos livros...');

  try {
    let response = await fetch(url);

    if (!response.ok) {
      console.error(`Erro ao buscar livros: ${response.status} - ${response.statusText}`);
      return;
    }

    let dados = await response.json();
    console.log('Dados recebidos:', dados);

    let divListDados = document.getElementById('listDados');
    divListDados.innerText = '';

    if (!Array.isArray(dados) || dados.length === 0) {
      console.log('Nenhum livro encontrado.');
      divListDados.innerHTML = '<p>Nenhum livro disponível.</p>';
      return;
    }

    dados.forEach(function (livro) {
      console.log('Adicionando livro:', livro);

      // Criação de elementos no HTML
      let divDados = document.createElement('div');
      let divTitle = document.createElement('div');
      let divSubtitle = document.createElement('div');
      let divPrice = document.createElement('div');
      let divImage = document.createElement('div');
      let divOpcoes = document.createElement('div');
      let spanExcluir = document.createElement('span');
      let imgExcluir = document.createElement('img');
      let spanEditar = document.createElement('span');
      let imgEditar = document.createElement('img');

      divDados.setAttribute('class', 'linha dados');
      imgExcluir.setAttribute('src', 'icones/excluir.png');
      imgEditar.setAttribute('src', 'icones/editar.png');

      divTitle.innerText = `Título: ${livro.title}`;
      divSubtitle.innerText = `Subtítulo: ${livro.subtitle}`;
      divPrice.innerText = `Preço: R$ ${parseFloat(livro.price).toFixed(2)}`;

      let img = document.createElement('img');
      img.setAttribute('src', livro.image);
      img.setAttribute('alt', livro.title);
      img.setAttribute('style', 'max-width: 100px; max-height: 100px;');

      divImage.appendChild(img);

      divListDados.appendChild(divDados);
      divDados.appendChild(divImage);
      divDados.appendChild(divTitle);
      divDados.appendChild(divSubtitle);
      divDados.appendChild(divPrice);
      divDados.appendChild(divOpcoes);

      divOpcoes.appendChild(spanEditar);
      spanEditar.appendChild(imgEditar);
      divOpcoes.appendChild(spanExcluir);
      spanExcluir.appendChild(imgExcluir);

      imgExcluir.addEventListener('click', function () {
        let resposta = confirm('Deseja realmente excluir este item?');

        if (resposta) {
          deleteLivro(livro.title); // Usando o título como identificador
        }
      });

      imgEditar.addEventListener('click', function () {
        // Preencher o formulário com os dados do livro para edição
        document.getElementById('title').value = livro.title;
        document.getElementById('subtitle').value = livro.subtitle;
        document.getElementById('image').value = livro.image;
        document.getElementById('price').value = livro.price;

        // Ativar modo de edição
        isEditing = true;
        livroOriginal = livro.title;

        botaoSalvar.innerText = 'Editar';
        botaoSalvar.onclick = function () {
          if (isEditing) {
            editLivro(livroOriginal); // Passa o título original para identificar o livro
          }
        };
      });
    });
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
  }
};
botaoSalvar.addEventListener('click', function () {
  if (!isEditing) {
    postLivro();
  }
});

window.addEventListener('load', function () {
  getLivros();
});
