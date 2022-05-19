import {Options, Vue} from 'vue-class-component';
import axios from 'axios';

// upbit으로부터 받은 데이터 타입
interface upbitDataType {
    trade_price: number;
    change_price: number;
    change_rate: number;
    change: string;
}

@Options({
    mounted() {
      // Mount 될 때 interval 시작
        this.getBTCInfoPerSec();
        this.getBTCInfoPerMin();
    },
    unmounted() {
      // Unmonunt할 때 interval 제거
        clearInterval(this.interverSecId);
        clearInterval(this.interverMinId);
    }
})
export default class Dashboard extends Vue {
    public apiURL: string = 'https://api.upbit.com/v1/ticker?markets=KRW-BTC';
    public interverSecId: number;
    public interverMinId: number;

    // upbit에서 데이터 받기 전 변수 초기화
    public upbitResponsePerSec: upbitDataType = {
        trade_price: 0,
        change_price: 0,
        change_rate: 0,
        change: "EVEN"
    };
    public upbitResponsePerMin: upbitDataType = {
        trade_price: 0,
        change_price: 0,
        change_rate: 0,
        change: "EVEN"
    };

    getBTCInfoPerSec = async () => {
        // 초기 값 설정
        this.upbitResponsePerSec = (await axios.get(this.apiURL)).data[0];

        // 1초마다 데이터 요청
        this.interverSecId = setInterval(async () => {
            this.upbitResponsePerSec = (await axios.get(this.apiURL)).data[0];
        }, 1000);
    };
    getBTCInfoPerMin = async () => {
        // 초기 값 설정
        this.upbitResponsePerMin = (await axios.get(this.apiURL)).data[0];

        // 1분마다 데이터 요청
        this.interverMinId = setInterval(async () => {
            this.upbitResponsePerMin = (await axios.get(this.apiURL)).data[0];
        }, 60000);
    };
}
