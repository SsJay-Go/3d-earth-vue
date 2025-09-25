import gradient from './earth/gradient.png';
import redCircle from './earth/redCircle.png';
import label from './earth/label.png';
import aperture from './earth/aperture.png';
import glow from './earth/glow.png';
import light_column from './earth/light_column.png';
import aircraft from './earth/aircraft.png';
import earth from './earth/earth.jpg';
export const citySite =  [{
  startArray: {
    name: '杭州',
    N: 30.246026,
    E: 120.210792,
  },
  endArray: [{
      name: '曼谷',
      N: 22, //维度
      E: 100.49074172973633, //经度
    },
    {
      name: '澳大利亚',
      N: -23.68477416688374,
      E: 133.857421875,
    },

    {
      name: '新疆维吾尔自治区',
      N: 41.748,
      E: 84.9023,
    },

    {
      name: '德黑兰',
      N: 35,
      E: 51,
    },
    {
      name: '德黑兰',
      N: 35,
      E: 51,
    },
    {
      name: '美国',
      N: 34.125447565116126,
      E: 241.7431640625,
    },
    {
      name: '英国',
      N: 51.508742458803326,
      E: 359.82421875,
    },
    {
      name: '巴西',
      N:  -9.96885060854611,
      E: 668.1445312499999,
    },
  ]
},
{
  startArray: {
    name: '北京',
    N: 39.89491,
    E: 116.322056,
  },
  endArray: [{
      name: '西藏',
      N: 29.660361, //维度
      E: 91.132212 //经度
    },
    {
      name: '广西',
      N: 22.830824,
      E: 108.30616
    },

    {
      name: '江西',
      N: 28.676493,
      E: 115.892151
    },

    {
      name: '贵阳',
      N: 26.647661,
      E: 106.630153
    }
  ]
}

]
export const earthConfig ={
      earth: {
        radius: 50,
        rotateSpeed: 0.002,
        isRotation: true
      },
      punctuation: {
        circleColor: 0x3892ff,
        lightColumn: {
          startColor: 0xe4007f,
          endColor: 0xffffff
        }
      },
      satellite: {
        show: true,
        rotateSpeed: 0.01,
        size: 1,
        number: 2
      }
    }
export  const fileSite = {
        gradient:gradient, 
        redCircle:redCircle,
        label:label,
        aperture:aperture,
        glow:glow,
        light_column:light_column,
        aircraft:aircraft,
        earth: earth
    };