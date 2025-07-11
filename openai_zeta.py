from openai import OpenAI


# this comes from train 0374
prompt = """### Instruction:
You are a code completion assistant and your task is to analyze user edits and then rewrite an excerpt that the user provides, suggesting the appropriate edits within the excerpt, taking into account the cursor location.

### User Edits:

User edited "crates/zed/src/zed/quick_action_bar.rs":
```diff
@@ -282,6 +282,26 @@
                                 }
                             },
                         );
+                        
+                        menu = menu.toggleable_entry(
+                            "Auto Signature Help",
+                            auto_signature_help_enabled,
+                            IconPosition::Start,
+                            Some(editor::actions::ToggleAutoSignatureHelp.boxed_clone()),
+                            {
+                                let editor = editor.clone();
+                                move |cx| {
+                                    editor
+                                        .update(cx, |editor, cx| {
+                                            editor.toggle_auto_signature_help_menu(
+                                                &editor::actions::ToggleAutoSignatureHelp,
+                                                cx,
+                                            );
+                                        })
+                                        .ok();
+                                }
+                            },
+                        );
 
                         menu = menu.separator();
 

```

User edited "crates/zed/src/zed/quick_action_bar.rs":
```diff
@@ -284,7 +285,7 @@
                         );
                         
                         menu = menu.toggleable_entry(
-                            "Auto Signature Help",
+                            "Inline Completions",
                             auto_signature_help_enabled,
                             IconPosition::Start,
                             Some(editor::actions::ToggleAutoSignatureHelp.boxed_clone()),

```

### User Excerpt:

```crates/zed/src/zed/quick_action_bar.rs
                                    editor
                                        .update(cx, |editor, cx| {
                                            editor.toggle_selection_menu(
                                                &editor::actions::ToggleSelectionMenu,
                                                cx,
                                            )
                                        })
                                        .ok();
                                }
                            },
                        );

                        menu = menu.toggleable_entry(
                            "Auto Signature Help",
                            auto_signature_help_enabled,
                            IconPosition::Start,
                            Some(editor::actions::ToggleAutoSignatureHelp.boxed_clone()),
                            {
                                let editor = editor.clone();
                                move |cx| {
                                    editor
                                        .update(cx, |editor, cx| {
                                            editor.toggle_auto_signature_help_menu(
                                                &editor::actions::ToggleAutoSignatureHelp,
<|editable_region_start|>
                                                cx,
                                            );
                                        })
                                        .ok();
                                }
                            },
                        );
                        
                        menu = menu.toggleable_entry(
                            "Inline Completions<|user_cursor_is_here|>",
                            auto_signature_help_enabled,
                            IconPosition::Start,
                            Some(editor::actions::ToggleAutoSignatureHelp.boxed_clone()),
                            {
                                let editor = editor.clone();
                                move |cx| {
                                    editor
                                        .update(cx, |editor, cx| {
                                            editor.toggle_auto_signature_help_menu(
                                                &editor::actions::ToggleAutoSignatureHelp,
                                                cx,
                                            );
                                        })
                                        .ok();
                                }
                            },
                        );

                        menu = menu.separator();

                        menu = menu.toggleable_entry(
                            "Inline Git Blame",
                            git_blame_inline_enabled,
                            IconPosition::Start,
                            Some(editor::actions::ToggleGitBlameInline.boxed_clone()),
                            {
<|editable_region_end|>
                                let editor = editor.clone();
                                move |cx| {
                                    editor
                                        .update(cx, |editor, cx| {
                                            editor.toggle_git_blame_inline(
                                                &editor::actions::ToggleGitBlameInline,
                                                cx,
```

### Response:
"""


# Modify OpenAI's API key and API base to use vLLM's API server.
openai_api_key = "EMPTY"
openai_api_base = "http://localhost:8000/v1"
client = OpenAI(
    api_key=openai_api_key,
    base_url=openai_api_base,
)
chat_response = client.chat.completions.create(model="zeta",
                                               messages=[
                                                   {"role": "user",
                                                    "content": prompt},
                                               ])
print(chat_response.choices[0].message.content)
