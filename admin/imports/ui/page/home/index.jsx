/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';
import Form from '../../component/general/form/form.jsx';

export default class HomePage extends BasePage
{
    getDefaultTitle()
    {
        return 'Home';
    }

    onSubmit(data)
    {
        // formData = new FormData(data);
        $.ajax({
            url: '/hello',
            type: 'post',
            contentType: false,
            processData: false,
            data: data,
            dataType: 'html',
            xhr: function(){
                var xhr = $.ajaxSettings.xhr(); // получаем объект XMLHttpRequest
                xhr.upload.addEventListener('progress', function(evt){ // добавляем обработчик события progress (onprogress)
                    if(evt.lengthComputable) { // если известно количество байт
                        // высчитываем процент загруженного
                        var percentComplete = Math.ceil(evt.loaded / evt.total * 100);
                        // устанавливаем значение в атрибут value тега <progress>
                        // и это же значение альтернативным текстом для браузеров, не поддерживающих <progress>
                        // progressBar.val(percentComplete).text('Загружено ' + percentComplete + '%');

                        console.dir('Загружено ' + percentComplete + '%');
                    }
                }, false);
                return xhr;
            },
            success: function(json){
                console.dir(json);
            },
            error: function(x, text){
                console.dir(text);
            },
        });
    }

	render()
    {
        return (
            <Layout
                title={this.getDefaultTitle()}
                central={
                    <div className="">
                        Here there be dragons

                        <Form
                            map={[
                                {
                                    code: 'one',
                                    type: String,
                                },
                                {
                                    code: 'two',
                                    type: String,
                                },
                            ]}
                            model={{
                                one: 'lala',
                                two: 'lolo',
                            }}
                            onSubmit={this.onSubmit.bind(this)}
                        />
                    </div>
                }
            />
        );
    }
}
