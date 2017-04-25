import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';

import Article from '/imports/api/entity/article.js';
import ArticleTag from '/imports/api/entity/article/tag.js';
import File from '/imports/api/entity/file.js';
import Embed from '/imports/api/entity/embed.js';

Meteor.startup(() => {

	if(!ArticleTag.count())
	{
		console.dir('Creating article types....');

		[
			{
				title: 'Событие', //TAPi18n.__('article.type.event'),
				sort: 100,
				color: 'golden-yellow',
				primary: true,
			},
			{
				title: 'Место', //TAPi18n.__('article.type.place'),
				sort: 200,
				color: 'lynch',
				primary: true,
			},
			{
				title: 'Быт', //TAPi18n.__('article.type.life'),
				sort: 300,
				color: 'ecstasy',
				primary: true,
			},
			{
				title: 'СССР', //TAPi18n.__('article.type.life'),
				sort: 400,
				color: 'monza',
				primary: false,
			},
			{
				title: 'Архитектурен', //TAPi18n.__('article.type.life'),
				sort: 500,
				color: 'hanada',
				primary: false,
			},
		].forEach(item => ArticleTag.collection.insert(item));

		console.dir('Article types created');
	}

	if(!File.count())
	{
		console.dir('Creating demo files............');

		[
			{
				title: 'Sony Center',
				url: '/img/sample1.jpg',
			},
			{
				title: 'Potsdamer Platz',
				url: '/img/sample2.jpg',
			},
			{
				title: 'Reichstag',
				url: '/img/sample3.jpg',
			},
			{
				title: 'Elephant',
				url: '/img/sample4.jpg',
			},
		].forEach(item => File.collection.insert(item));

		console.dir('Demo files created');
	}

	if(!Embed.count())
	{
		let files = File.find({fields: ['_id']});
	}

	if(!Article.count())
	{
		console.dir('Creating articles............');

		let tags = ArticleTag.find({fields: ['_id', 'title']});
		let files = File.find({fields: ['_id']});
		let embed = Embed.find();
		let text = "Короче... Походу я только что получил свой первый штраф в Германии. На лобовое стекло под дворники мне положили такую бумажонку.\r\n\r\n"+
				"*тут фотка бумажонки*\r\n\r\n"+
				"Показал я эту бумажку своим друзьям с работы, и оказывается, что на одной ее стороне написано, что это просто \"friendly warning\", а на другой, что это \"fine\". Куда платить - не понятно. Сколько платить - не понятно. За что платить - не понятно. Мне сказали, что мне в Россию должно прийти письмо с описанием и реквизитами, и пока я судорожно думаю, что с этим делать, я решил разобраться, за что может быть штраф.\r\n\r\n"+

				"А штраф, скорее всего, за отсутствие очередной дурацкой наклейки на лобовом стекле, которая называется *тут как называется наклейка*. Если вкратце, то эта наклейка говорит о том, что на своем авто ты можешь заехать в жилую зону. Нет наклейки - не можешь. Заехал - штраф 40 евро.\r\n\r\n"+

				"Чтобы не получить еще один такой штраф, я решил скорейшим образом приобрести такую наклейку. В интернетах вычитал, что ее продают в офисах некой организации под названием dekra.\r\n\r\n"+

				"Утром я сел в авто и покатил до ближайшей заправки, потому как бак у меня был уже почти пустой после долгой дороги из России. Заплатив 20 евро за пол-бака бензина, я уже хотел было ехать дальше, но тут заметил автосервис неподалеку. Сфоткав на телефон аналогичную наклейку на соседней машине, я отправился в этот автосервис и стал спрашивать у продавца, могу ли я купить такую наклейку (и тыкаю такой пальцем в телефон). И, о чудо, могу! Заплатив 6 евро, показав свой русский талон регистрации и объяснив, где тут лошадиные силы, год выпуска и вин-номер, я уже бежал назад счастливый-довольный с наклеечкой.\r\n\r\n"+

				"Вот она какая: *тут фотка наклейки*. С детства люблю клеить наклейки!\r\n\r\n"+

				"Мораль: не забывай клеить дурацкие зеленые наклейки, иначе придется \"купить\" 8 таких \"наклеек\" в виде штрафа.\r\n\r\n";

		[
			{
				title: 'Про наклейку на лобовое стекло машины',
				text: text,
				tagId: [tags[0]._id, tags[2]._id, tags[3]._id, tags[4]._id],
				headerColor: 'silver',
				headerImage: files[0]._id,
			},
			{
				title: 'Воскресенье в Германии',
				text: text,
				tagId: [tags[1]._id],
				headerColor: 'fresh-onion',
				headerImage: files[1]._id,
			},
			{
				title: 'Про парковку',
				text: text,
				tagId: [tags[2]._id, tags[1]._id],
				headerImage: files[2]._id,
			},
		].forEach(item => Article.collection.insert(item));

		console.dir('Articles created');
	}

});
