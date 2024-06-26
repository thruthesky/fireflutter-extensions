import axios from "axios";
import "mocha";


import { expect } from "chai";

const url = "http://127.0.0.1:5001/withcenter-test-3/us-central1/sendPushNotifications";

const token1 = 'dANRXdOM4kGnqEkpRIR_lr:APA91bF2ghYt6DDbdCOXXFu5tMm_jfUvmR6ygSuSxFjGfdjz6Uj8nV61kjiO0wAMhyQ96RPXNI_q8NLd4wZHPUZpIxVCJ-LKeQwRnnJEExgFNMwZjkwEN3HQprQynl4D-nqDDCSixOGT';

describe('sendPushNotifications', () => {

    it('Token undefined error', async () => {
        const re = await axios.get(url + '?title=t&body=b');
        // console.log('Token undefined error -> re; ', re.data);
        expect(re.data[0].code).to.equal('messaging/missing-tokens');
    });
    it('Title undefined', async () => {

        const re = await axios.get(url + '?tokens=a,b,c&body=b');
        // console.log('Title undefined error -> re; ', re.data);
        expect(re.data[0].code).to.equal('messaging/missing-title');
    });

    it('Body undefined', async () => {
        const re = await axios.get(url + '?tokens=a,b,c&title=t');
        // console.log('Body undefined error -> re; ', re.data);
        expect(re.data[0].code).to.equal('messaging/missing-body');
    });

    /**
     * If there is an error related to tokens, it adds error information to each array item and returns.
     *
     */
    it('Send failure due to wrong token', async () => {
        const re = await axios.get(url + '?tokens=a,b,c&title=t&body=b');
        // console.log('send failure -> re; ', re.data);
        expect(re.data[0].code).to.equal('messaging/send-one-error');
    });
    it('Send failure due to wrong token', async () => {
        const re = await axios.get(url + '?tokens=a,b,c&title=t&body=b&shortErrorMessage=true');
        // console.log('send failure -> re; ', re.data);
        expect(re.data[0].code).to.equal('messaging/send-one-error');
        expect(re.data[1].status).to.equal('INVALID_ARGUMENT');
        expect(re.data[2].token).to.equal('c');
    });
    // 푸시 메시지 성공
    it('Send success', async () => {
        const re =
            await axios.get(url + '?tokens=' + token1 + ',b,c&title=t&body=b' + new Date().toISOString());

        // console.log('send failure -> re; ', re.data);
        expect(re.data[0].code).to.equal('');
        expect(re.data[0].token).to.equal(token1);
        expect(re.data[1].error.status).to.equal('INVALID_ARGUMENT');
        expect(re.data[2].error.status).to.equal('INVALID_ARGUMENT');
        expect(re.data[2].token).to.equal('c');
    });

    // 푸시 메시지 concurrent 작업 테스트
    // maxConcurrent=2 로 설정하면 Promise.allSettled() 를 통해서 한번의 async/await 을 통해서 2개의 푸시 메시지를 동시에 보낼 수 있다.
    it('Send success', async () => {
        const re =
            await axios.get(url + '?tokens=' + token1 + ',b,c&maxConcurrent=2&title=t&body=b' + new Date().toISOString());

        // console.log('send failure -> re; ', re.data);
        expect(re.data[0].code).to.equal('');
        expect(re.data[0].token).to.equal(token1);
        expect(re.data[1].error.status).to.equal('INVALID_ARGUMENT');
        expect(re.data[2].error.status).to.equal('INVALID_ARGUMENT');
        expect(re.data[2].token).to.equal('c');
    });
});



