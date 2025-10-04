// Monaco Editor + 달빛약속 런타임/언어 제공자
import * as monaco from "monaco-editor";
import { DalbitYaksokApplier, LANG_ID } from "@dalbit-yaksok/monaco-language-provider";
import { YaksokSession } from "@dalbit-yaksok/core";

// 출력창 헬퍼
const outEl = document.getElementById("output");
const print = (msg, type = "out") => {
  const prefix = type === "err" ? "[오류] " : "";
  outEl.textContent += prefix + String(msg) + "\n";
};

// 에디터 준비 (달빛약속 문법 하이라이트 적용)
const languageProvider = new DalbitYaksokApplier("");
languageProvider.register(monaco.languages); // 문법 등록

const editor = monaco.editor.create(document.getElementById("editor"), {
  language: LANG_ID,
  value: `"안녕, 세상!" 보여주기`,
  theme: "vs",
  fontSize: 16,
  fontLigatures: true,
  automaticLayout: true,
});
languageProvider.configEditor(editor); // 추가 설정

// 실행 함수 (매번 새로운 세션 생성)
async function run() {
  outEl.textContent = ""; // 출력 초기화
  const code = editor.getValue();

  // 실행할 때마다 새로운 세션 생성
  const session = new YaksokSession({
    stdout: (message) => print(message, "out"),
    stderr: (message) => print(message, "err"),
  });

  // 코드 실행
  session.addModule("main", code);
  try {
    await session.runModule("main");
  } catch (e) {
    print(e && e.message ? e.message : e, "err");
  }
}

// 단축키: Ctrl/Cmd + Enter
window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run();
});

// 버튼 연결
document.getElementById("run").onclick = run;
document.getElementById("clear").onclick = () => (outEl.textContent = "");