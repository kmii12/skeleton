import { describe, it } from "mocha";
import { getName } from "../hoge";
import { assert } from "chai";

//describe内で何について見るかを明記し、itでは何をチェックしているかを示す
describe("getName関数を見る", () => {
  //it内ではchaiによるアサーションを行いテストを行う
  it("本当にmikiって返す？ ", () => {
    //今回はassert.equal(getName(), "taro");の箇所でgetName()がtaroと返しているかどうかを見ている
    assert.equal(getName(), "miki");
  });
});
